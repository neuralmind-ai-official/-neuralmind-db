import axios from "axios";

const baseURL = process.env.NEURALMIND_REST
  ? process.env.NEURALMIND_REST
  : +`https://api.neuralmind.io/`;
export const getDBByAPIKey = async (api_key: string, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: any = await axios.put(
        baseURL + `api/v1/db-schema-api-key`,
        { api_key, ...payload }
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const dbQuery = async (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: any = await axios.post(
        baseURL + `v1/api-db-query`,
        payload
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
