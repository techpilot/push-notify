const EndpointModel = require("./endpointModel");

const getSubscriptions = async (endpoint, userId) => {
  try {
    const userEndpoints = await EndpointModel.find({
      endpoint: endpoint,
      userId: userId,
    });

    return {
      data: userEndpoints,
      error: false,
      message: "success",
      statusCode: 201,
    };
  } catch (error) {
    return {
      data: {},
      error: true,
      message: "Sorry an error occurred",
      statusCode: 500,
    };
  }
};

module.exports = getSubscriptions;

const getEndpoints = async (endpoint) => {
  try {
    const endpoints = await EndpointModel.find({ endpoint: endpoint });

    return {
      data: endpoints,
      error: false,
      message: "success",
      statusCode: 201,
    };
  } catch (error) {
    return {
      data: {},
      error: true,
      message: "Sorry an error occurred",
      statusCode: 500,
    };
  }
};

module.exports = getEndpoints;
