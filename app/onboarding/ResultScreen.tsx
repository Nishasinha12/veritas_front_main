import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, Pressable, Alert, } from "react-native";
import { useLocalSearchParams } from "expo-router";
import usePointsStore from "../../store/usePointsStore";

export default function ResultScreen() {
  const { result, type } = useLocalSearchParams();
  let parsed: any = null;
  try {
    parsed = result ? JSON.parse(result as string) : null;
  } catch (e) {
    console.error("Failed to parse result:", e);
  }

  const cleanText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\\n/g, "\n")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\s{3,}/g, "\n\n")
      .trim();
  };
  const { addFeedPost } = usePointsStore();

  const formatJsonToText = (data: any): string => {
    if (typeof data === "string") return cleanText(data);
    if (typeof data === "object" && data !== null) {
      let formatted = "";
      if (data.summary) {
        formatted += cleanText(data.summary);
      } else if (data.result) {
        formatted += cleanText(data.result);
      } else if (data.analysis) {
        formatted += cleanText(data.analysis);
      } else if (data.verdict) {
        formatted += `Verdict: ${data.verdict}\n\n`;
        if (data.explanation) formatted += cleanText(data.explanation);
      } else if (data.sentiment) {
        formatted += `Sentiment: ${data.sentiment}\n\n`;
        if (data.confidence) formatted += `Confidence: ${data.confidence}\n\n`;
        if (data.explanation) formatted += cleanText(data.explanation);
      } else if (data.detected) {
        formatted += `Detection: ${data.detected ? "Yes" : "No"}\n\n`;
        if (data.details) formatted += cleanText(data.details);
      } else if (data.is_misinformation !== undefined) {
        formatted += `Misinformation: ${data.is_misinformation ? "Yes" : "No"}\n\n`;
        if (data.reasoning) formatted += "Reasoning:\n" + cleanText(data.reasoning);
      } else if (data.prediction) {
        // Image / Audio detection
        formatted += `Prediction: ${data.prediction}\n\n`;
        if (data.confidence !== undefined) {
          formatted += `Confidence: ${(data.confidence * 100).toFixed(1)}%`;
        }
      } else {
        Object.entries(data).forEach(([key, value]) => {
          if (key === "heatmap_base64") return; // skip raw base64 in text
          const formattedKey = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
          if (typeof value === "string") {
            formatted += `${formattedKey}:\n${cleanText(value)}\n\n`;
          } else {
            formatted += `${formattedKey}: ${value}\n\n`;
          }
        });
      }
      return formatted.trim() || "No readable content found.";
    }
    return "No result found.";
  };

  const info: Record<string, { title: string; color: string; emoji: string }> = {
    summarise: { title: "Summary", color: "#8B5CF6", emoji: "🧠" },
    misinfo: { title: "Misinformation Check", color: "#F59E0B", emoji: "⚠️" },
    sentiment: { title: "Sentiment Analysis", color: "#10B981", emoji: "💬" },
    detect_image: { title: "Image Detection", color: "#3B82F6", emoji: "🖼️" },
    detect_audio: { title: "Audio Detection", color: "#EC4899", emoji: "🎧" },
  };

  const selected = info[type as string] || { title: "Result", color: "#9CA3AF", emoji: "✨" };
  const displayText = formatJsonToText(parsed);

  const isImageDetection = type === "detect_image";
  const heatmap = parsed?.heatmap_base64 ?? null;
  const predictionLabel = parsed?.prediction as string | undefined;
  const isFake = predictionLabel?.toLowerCase().includes("fake");
  const predictionColor = isFake ? "#EF4444" : "#10B981";
  const handlePostToHome = () => {
    addFeedPost({
      content: `✅ I verified something using SafeGuard AI.\n\nResult: ${predictionLabel || selected.title
        }\n\n${displayText.slice(0, 120)}...`,
      resultType: type as string,
      archived: false,
    });

    Alert.alert("Posted!", "Your result has been shared to the home feed.");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
      bounces={true}
    >
      <View style={styles.header}>
        <Text style={[styles.emoji, { color: selected.color }]}>{selected.emoji}</Text>
        <Text style={styles.title}>{selected.title}</Text>
      </View>

      {/* Prediction badge for image/audio */}
      {predictionLabel && (
        <View style={[styles.badge, { borderColor: predictionColor, backgroundColor: predictionColor + "22" }]}>
          <Text style={[styles.badgeText, { color: predictionColor }]}>
            {isFake ? "🚨 FAKE" : "✅ REAL"} · {(parsed.confidence * 100).toFixed(1)}% confidence
          </Text>
        </View>
      )}

      {/* Grad-CAM heatmap — only for image detection */}
      {isImageDetection && heatmap && (
        <View style={styles.heatmapContainer}>
          <Text style={styles.heatmapLabel}>🔥 Grad-CAM Heatmap</Text>
          <Text style={styles.heatmapSub}>
            Red/warm areas = regions the model focused on most
          </Text>
          <Image
            source={{ uri: `data:image/png;base64,${heatmap}` }}
            style={styles.heatmapImage}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Show a "no heatmap" notice if image detection but heatmap missing */}
      {isImageDetection && !heatmap && (
        <View style={styles.noHeatmap}>
          <Text style={styles.noHeatmapText}>⚠️ Heatmap unavailable for this image</Text>
        </View>
      )}


      {/* Main result card */}
      <View style={[styles.card, { borderColor: selected.color, shadowColor: selected.color }]}>
        <Text style={styles.text}>{displayText}</Text>
      </View>

      <Pressable
        style={[styles.postBtn, { backgroundColor: selected.color }]}
        onPress={handlePostToHome}
      >
        <Text style={styles.postBtnText}>
          📢 Post to Home (+10 pts earned)
        </Text>
      </Pressable>

      <Text style={styles.footerNote}>Processed securely by your AI assistant ⚡</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 60, // ← key! gives space at bottom
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 20,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#E5E7EB",
    textAlign: "center",
  },
  badge: {
    borderWidth: 1.2,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  heatmapContainer: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  heatmapLabel: {
    color: "#F97316",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  heatmapSub: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 12,
    textAlign: "center",
  },
  heatmapImage: {
    width: "100%",
    height: 260,
    borderRadius: 10,
  },
  noHeatmap: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    alignItems: "center",
  },
  noHeatmapText: {
    color: "#94A3B8",
    fontSize: 13,
  },
  card: {
    backgroundColor: "#1E293B",
    borderWidth: 1.2,
    borderRadius: 16,
    padding: 18,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  text: {
    color: "#F1F5F9",
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  footerNote: {
    color: "#64748B",
    fontSize: 13,
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },

  postBtn: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  postBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});