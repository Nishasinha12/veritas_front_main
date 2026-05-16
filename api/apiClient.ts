import axios from "axios";
// Note: expo-file-system removed — not in package.json and unused in active code
import { Platform, Alert } from "react-native";
import useProfileStore from "../store/useProfileStore";
import { router } from "expo-router";
type AuthState = {
  token: string | null;
  logout: () => void;
};
// Uses your local IP in dev mode, Render URL in production
const BASE_URL = "https://veritas-main-backend-3.onrender.com";


// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

// Detect Image (Base64 Upload)
//export const detectImage = async (imageData) => {
//  try {
// Get correct file path depending on platform
//  const uri =
//  Platform.OS === "ios"
//  ? imageData.uri.replace("file://", "")
//  : imageData.uri;

// Convert image to Base64
//const base64Data = await FileSystem.readAsStringAsync(uri, {
//encoding: FileSystem.EncodingType.Base64,
//});

// Send Base64 to Flask API
//const response = await apiClient.post("/api/v1/detect/image", {
//  image_base64: base64Data,
//  filename: "image.jpg",
//});

//return response.data;
//} catch (err) {
//  console.error("Error reading or sending image:", err);
//  throw err;
//}
//};
// Helper for uploading audio files

// 2. Request Interceptor: Add the Bearer Token to every outgoing request

// 3. Response Interceptor: Handle 401 Unauthorized errors globally


export const detectImage = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
    name: 'image.jpg',
    type: 'image/jpeg',
  } as any);

  return apiClient.post("/api/v1/detect/image", formData, {
    headers: {
      // Note: Axios automatically sets the correct boundary for multipart/form-data
      "Content-Type": "multipart/form-data",
    },
  });
};


export const detectAudio = (audioData: FormData) => {
  return apiClient.post("/api/v1/detect/audio", audioData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Text-based routes
export const checkMisinfo = (text: string) =>
  apiClient.post("/api/v1/misinfo", { text });

export const analyzeSentiment = (text: string) =>
  apiClient.post("/api/v1/sentiment", { text });

export const summarizeText = (text: string) =>
  apiClient.post("/api/v1/summarize", { text });

// Optional: Health check route
export const checkHealth = () => apiClient.get("/api/v1/health");


// 🆕 NEW: Interaction API calls
export const createPost = (postData: any) =>
  apiClient.post("/post/create", postData);

export const getHomeFeed = () =>
  apiClient.get("/feed");

export const toggleLike = (post_id: number) =>
  apiClient.post("/post/like", { post_id });

export const submitPoll = (post_id: number, vote: 'real' | 'fake') =>
  apiClient.post("/post/poll", { post_id, vote });

export default apiClient;
