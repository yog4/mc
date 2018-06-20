module.exports = function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const k8s = require('@kubernetes/client-node');

  //var k8sApi = k8s.Config.fromFile("D:\\home\\site\\wwwroot\\servers\\t3cluster-config");
var k8sApi = k8s.Config.defaultClient();
  // kubectl patch sts azure-minecraft-statefulset -p '{"spec":{"replicas":3}}'

  // Query
  // public patchNamespacedStatefulSet (name: string, namespace: string, body: any, pretty?: string) : Promise<{ response: http.ClientResponse; body: V1StatefulSet;  }> {
  //k8sApi.listServiceForAllNamespaces()
  k8sApi.patchNamespacedStatefulSetScale("azure-minecraft-statefulset", "default", "3", "true")
  //k8sApi.patchNamespacedResourceQuotaStatus("azure-minecraft-statefulset")
    .then((res) => {
      context.log('SUCCESS');
      context.log(res);
      context.log(res.body);
      // Parse
      var list = []
      res.body.items.forEach(function(entry) {
        context.log(entry.metadata.name + "\t" + entry.status.loadBalancer.ingress + "\t" + entry.spec.ports)
        list.push({
          name: entry.metadata.name,
          loadBalancer: entry.status.loadBalancer.ingress,
          ports: entry.spec.ports
        });
      })
      // Set the Response
      context.res = {
        // status: 200, /* Defaults to 200 */
        headers: {
        'Content-Type': 'application/json'
    },
        body: list
      };
      context.log(list);
      context.done();
    }), ((reason) => {
      context.log('ERROR');
      context.res = {
        status: 400,
        body: reason
      };
      context.done();
    });
  };
