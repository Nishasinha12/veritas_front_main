import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import apiClient from "../api/apiClient";
import usePointsStore from "../store/usePointsStore";

type AudioFile = {
  uri: string;
  name: string;
  mimeType?: string;
};

export default function ComposeScreen() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [linkPreview, setLinkPreview] = useState<string | null>(null);
  const { incrementSearch } = usePointsStore();

  // Pick Image
  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setMediaUri(result.assets[0].uri);
      setAudioFile(null);
    }
  };

  // Pick Audio
  const handlePickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });
      console.log("Document Picker Result:", JSON.stringify(result, null, 2));
      if (!result.canceled) {
        const fileAsset = result.assets[0];
        setAudioFile({
          uri: fileAsset.uri,
          name: fileAsset.name,
          mimeType: fileAsset.mimeType,
        });
        setMediaUri(null);
      }
    } catch (error) {
      console.log("Error picking audio:", error);
      Alert.alert("Error", "Unable to pick audio file");
    }
  };

  // Add Link Preview
  const handleAddLink = () => {
    if (!text.includes("http")) {
      Alert.alert("No link found", "Paste a link into your post first.");
      return;
    }
    const words = text.split(" ");
    const found = words.find((w) => w.startsWith("http"));
    if (found) setLinkPreview(found);
  };

  // Fact Check Button Handler---------------------------


  // Fact Check Button Handler — ONLY TEXT + IMAGE
  const handleFactCheck = async () => {
    if (!text.trim() && !mediaUri) {
      Alert.alert(
        "Missing Input",
        "Please enter a headline or upload an image to fact-check."
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // Add text (optional)
      formData.append("claim", text || "");

      // Add image (optional)
      if (mediaUri) {
        formData.append("image", {
          uri: mediaUri,
          name: "photo.jpg",
          type: "image/jpeg",
        } as any);
      }

      const result = await apiClient
        .post("/verify", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data);
      
      incrementSearch();
        
      router.push({
        pathname: "/onboarding/ResultScreen",
        params: { type: "factcheck", result: JSON.stringify(result) },
      });

    } catch (error) {
      console.log("Fact check error:", error);
      Alert.alert("❌ Error", "Could not connect to backend. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  //----------------------------------------------------



  // Main Post/Verify Button-------------------------


  const handlePost = async (): Promise<void> => {
    if (!text.trim() && !mediaUri && !audioFile) return;
    setLoading(true);
    try {
      const lowerText = text.toLowerCase();
      const wantsSummary =
        lowerText.includes("summarize") || lowerText.includes("summarize");
      const wantsMisinformation =
        lowerText.includes("misinfo") ||
        lowerText.includes("fake") ||
        lowerText.includes("fact check") ||
        lowerText.includes("verify");
      const wantsSentiment =
        lowerText.includes("sentiment") ||
        lowerText.includes("emotion") ||
        lowerText.includes("positive") ||
        lowerText.includes("negative");

      let result: any = null;
      let resultType = "";

      if (wantsSummary) {
        resultType = "summarise";
        result = await apiClient
          .post("/api/v1/summarise", { text })
          .then((r) => r.data);
      } else if (wantsMisinformation) {
        resultType = "misinfo";
        result = await apiClient
          .post("/api/v1/misinfo", { text })
          .then((r) => r.data);
      } else if (wantsSentiment) {
        resultType = "sentiment";
        result = await apiClient
          .post("/api/v1/sentiment", { text })
          .then((r) => r.data);
      } else if (mediaUri) {
        resultType = "detect_image";
        const imageData = new FormData();
        imageData.append("image", {
          uri: mediaUri,
          name: "photo.jpg",
          type: "image/jpeg",
        } as any);
        result = await apiClient
          .post("/api/v1/detect/image", imageData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((r) => r.data);
      } else if (audioFile) {
        resultType = "detect_audio";
        const audioData = new FormData();
        // ✅ THIS IS THE FIX
        audioData.append("file", {
          uri: audioFile.uri,
          name: audioFile.name,
          type: audioFile.mimeType || "audio/*",
        } as any);
        result = await apiClient
          .post("/api/v1/detect/audio", audioData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((r) => r.data);
      } else {
        setLoading(false);
        return Alert.alert(
          "No specific intent detected",
          "Please mention what you want to do."
        );
      }
      incrementSearch(); // +10 points every search
      router.push({
        pathname: "/onboarding/ResultScreen",
        params: { type: resultType, result: JSON.stringify(result) },
      });

      setText("");
      setMediaUri(null);
      setAudioFile(null);
    } catch (error) {
      console.error("Post Error:", error);
      Alert.alert("❌ Error", "Could not connect to backend. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home"); // ✅ fallback
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* Header in compose.tsx */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#E5E7EB" />
        </Pressable>
        <Image
        source={require("../assets/logo2.png")}
        style={{ width: 80, height: 40 }}
        resizeMode="contain"
        />

        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.prompt}>What do you want to verify?</Text>

      {/* Text Input */}
      <TextInput
        placeholder="Start typing your thoughts..."
        placeholderTextColor="#9ca3af"
        value={text}
        onChangeText={setText}
        multiline
        maxLength={280}
        style={styles.input}
      />
      <Text style={styles.charCount}>{text.length}/280</Text>

      {/* Photo Preview */}
      {mediaUri && (
        <View style={styles.attachment}>
          <Image source={{ uri: mediaUri }} style={styles.preview} />
          <Pressable
            style={styles.removeBtn}
            onPress={() => setMediaUri(null)}
          >
            <Ionicons name="close-circle" size={22} color="#F87171" />
          </Pressable>
        </View>
      )}

      {/* Audio Preview */}
      {audioFile && (
        <View style={styles.audioCard}>
          <Ionicons
            name="musical-notes-outline"
            size={22}
            color="#A78BFA"
          />
          <Text style={{ flex: 1, color: "#E5E7EB" }} numberOfLines={1}>
            {audioFile.name}
          </Text>
          <Pressable onPress={() => setAudioFile(null)}>
            <Ionicons name="close" size={20} color="#F87171" />
          </Pressable>
        </View>
      )}

      {/* Link Preview */}
      {linkPreview && (
        <View style={styles.linkCard}>
          <Ionicons name="link-outline" size={20} color="#A78BFA" />
          <Text style={styles.linkText} numberOfLines={1}>
            {linkPreview}
          </Text>
          <Pressable onPress={() => setLinkPreview(null)}>
            <Ionicons name="close" size={18} color="#F87171" />
          </Pressable>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.row}>
        <Pressable style={styles.chip} onPress={handlePickPhoto}>
          <Ionicons name="image-outline" size={18} color="#A78BFA" />
          <Text style={styles.chipText}> Photo</Text>
        </Pressable>

        <Pressable style={styles.chip} onPress={handlePickAudio}>
          <Ionicons
            name="musical-notes-outline"
            size={18}
            color="#A78BFA"
          />
          <Text style={styles.chipText}> Audio</Text>
        </Pressable>

        <Pressable style={styles.chip} onPress={handleFactCheck}>
          <Ionicons name="search-outline" size={18} color="#A78BFA" />
          <Text style={styles.chipText}> Fact Check</Text>
        </Pressable>

        <Pressable style={styles.chip} onPress={handleAddLink}>
          <Ionicons name="link-outline" size={18} color="#A78BFA" />
          <Text style={styles.chipText}> Link</Text>
        </Pressable>
      </View>

      {/* Verify Button */}
      <Pressable
        style={[
          styles.postBtn,
          { opacity: text || mediaUri || audioFile ? 1 : 0.5 },
        ]}
        disabled={(!text && !mediaUri && !audioFile) || loading}
        onPress={handlePost}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: "700" }}>Verify</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#0a0a19", // ✅ match app/_layout dark color
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#374151",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#E5E7EB" },
  prompt: {
    marginTop: 16,
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  input: {
    margin: 16,
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 12,
    minHeight: 140,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#374151",
    fontSize: 15,
    color: "#E5E7EB",
  },
  charCount: {
    alignSelf: "flex-end",
    marginRight: 20,
    marginBottom: 8,
    color: "#9CA3AF",
    fontSize: 12,
  },
  attachment: { marginHorizontal: 16, marginBottom: 12, position: "relative" },
  preview: { width: "100%", height: 180, borderRadius: 12 },
  removeBtn: { position: "absolute", top: 6, right: 6 },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
    gap: 8,
  },
  linkText: { flex: 1, color: "#A78BFA" },
  audioCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
    gap: 8,
  },
  row: { flexDirection: "row", gap: 12, paddingHorizontal: 16, flexWrap: "wrap" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#4B5563",
  },
  chipText: { color: "#A78BFA", fontWeight: "500" },
  postBtn: {
    marginTop: "auto",
    marginHorizontal: 16,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#8B5CF6",
    elevation: 3,
  },
});