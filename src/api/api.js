import axios from "axios";

const api = axios.create({
  baseURL: "https://movies-api-8kc3.onrender.com/api" 
});

export default api;
