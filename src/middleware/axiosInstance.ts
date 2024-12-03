import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Axios instance setup
const privateAxios = axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const publicAxios = axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: true,
});

privateAxios.interceptors.request.use(
  async (config) => {
    console.log(process.env.BASE_URL);
    const accessToken = await AsyncStorage.getItem("token");
    console.log("TOKEN:", accessToken);
    if (accessToken) {
      config.headers["Authorization"] = "Bearer " + accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getNewTokens = async (
  refreshToken: string
): Promise<{ token: string }> => {
  try {
    const response = await publicAxios.post(
      "/auth/refresh",
      {},
      {
        headers: {
          Authorization: "Bearer " + refreshToken,
        },
      }
    );
    return response.data; // Assuming the API returns { token }
  } catch (error: any) {
    console.error("Error refreshing tokens:", error.response?.data || error);
    throw error; // Propagate the error to be handled in the calling function
  }
};

export { privateAxios, publicAxios };
