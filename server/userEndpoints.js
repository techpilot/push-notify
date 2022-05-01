const EndpointModel = require("./endpointModel");

const getUserEndpoints = async (userId) => {
  try {
    const userEndpoints = await EndpointModel.find({ userId });

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

module.exports = getUserEndpoints;
