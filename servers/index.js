module.exports = function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const k8s = require('@kubernetes/client-node');

  var k8sApi = k8s.Config.fromFile("D:\\home\\site\\wwwroot\\servers\\t3cluster-config");

  // Query
  k8sApi.listServiceForAllNamespaces()
    .then((res) => {
      context.log('SUCCESS');
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
