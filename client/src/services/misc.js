import axios from "axios";
const baseUrl = "/api";

export const ping = async () => {
  const response = await axios.get(`${baseUrl}/ping`);
  return response.data;
};

export const healthCheck = async () => {
  const response = await axios.get(`${baseUrl}/ping/health`);
  return response.data;
};

export const resetTestDB = async () => {
  try {
    const response = await axios.post(`${baseUrl}/testing/`);
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

export default { ping, healthCheck, resetTestDB };
