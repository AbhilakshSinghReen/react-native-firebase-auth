import axiosInstance from "./axiosInstance";
import apiEndpoints from "./apiEndpoints";
import auth from "@react-native-firebase/auth";

class APIClient {
  constructor() {
    this.auth = auth();

    this.requestMethods = {
      GET: axiosInstance.get,
      POST: axiosInstance.post,
      PUT: axiosInstance.put,
      PATCH: axiosInstance.patch,
      DELETE: axiosInstance.delete,
    };
  }

  async makeRequest(method, url, body = {}, headers = {}, addAuth = false) {
    console.log("making request");

    if (addAuth) {
      const authUser = this.auth.currentUser;
      if (!authUser) {
        console.log("null auth user");
        return {
          success: false,
          error: {
            code: "api_client_error",
          },
        };
      }

      const accessToken = await authUser.getIdToken();
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const requestConfig = {
      headers: headers,
    };

    console.log(addAuth);
    console.log(headers);

    try {
      console.log("sending request");
      let response = null;
      if (method === "GET") {
        response = await this.requestMethods["GET"](url, requestConfig);
      } else {
        response = await this.requestMethods[method](url, body, requestConfig);
      }

      //   const response = await axios.get("/foo-you");
      //   const response = await fetch("http://localhost:3000/foo-you");
      //   console.log(response.status);

      // TODO: will we ever have non-JSON responses?
      const responseData = await response.data;
      return responseData;
    } catch (error) {
      console.log("Error at make request:");
      console.log(error);

      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        return error.response.data;
      }

      return {
        success: false,
        error: {
          code: "api_client_error",
          message: JSON.stringify(error),
        },
      };
    }
  }

  async getAuthenticatedUser() {
    console.log("sending request");
    const responseData = await this.makeRequest("GET", apiEndpoints.auth.authenticatedUser, {}, {}, true);
    return responseData;
  }

  async getUsersOfType(getUserFilterType) {
    const endpoint = apiEndpoints.auth.users + `?getUserFilterType=${getUserFilterType}`;
    const responseData = await this.makeRequest("GET", endpoint, {}, {}, true);
    return responseData;
  }

  async createUser(userType, fullName, email, phoneNumber, address) {
    const requestBody = {
      userType: userType,
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      address: JSON.stringify(address),
    };

    const responseData = await this.makeRequest("POST", apiEndpoints.auth.users, requestBody, {}, true);
    return responseData;
  }

  async patchUserRequestOrActivation(userId, patchMethod) {
    const responseData = await this.makeRequest(
      "PATCH",
      apiEndpoints.auth.users,
      {
        userId: userId,
        patchMethod: patchMethod,
      },
      {},
      true
    );
    return responseData;
  }
}

const apiClient = new APIClient();
module.exports = apiClient; // { default: apiClient, APIClient };
