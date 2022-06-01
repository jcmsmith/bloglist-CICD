import axios from "axios";
const baseUrl = "/api/users";

export const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export const create = async (user) => {
  const response = await axios.post(baseUrl, user);
  return response.data;
};

export const getOne = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};
