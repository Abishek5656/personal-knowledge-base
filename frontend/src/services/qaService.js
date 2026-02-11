import api from "./api";

export const askQuestion = (question) => {
  return api.post("/qa/ask", { question });
};
