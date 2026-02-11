import api from "./api";

export const getStatus = () => {
  return api.get("/status");
};
