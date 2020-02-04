import ServiceDiscovery from "aws-sdk/clients/servicediscovery";

const client = new ServiceDiscovery({ region: "ap-southeast-2" });

export const services = {
  discover: async (namespace, service, params = {}) => {
    if (!namespace || !service) {
      throw new Error(
        `Service Discovery Error: invalid or missing namespace or service: ${namespace}, ${service}`
      );
    }
    const queryParams = {
      NamespaceName: namespace,
      ServiceName: service,
      QueryParameters: params
    };

    return await client
      .discoverInstances(queryParams)
      .promise()
      .then(data => data.Instances);
  },
  find: async (namespace, service, instanceId, params = {}) => {
    const { discover } = services;
    const result = await discover(namespace, service, params);
    const instance = result.find(item => item.InstanceId === instanceId);
    if (!instance) {
      throw new Error(
        `no service found: ${namespace}, ${service}, ${instance}`
      );
    } else {
      return {
        instance,
        attributes: instance.Attributes
      };
    }
  },
  listNamespaces: async () => {
    return await client.listNamespaces().promise();
  },
  listServices: async () => {
    return await client.listServices().promise();
  }
};
