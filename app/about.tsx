import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function AboutPage() {
  const [aboutExpanded, setAboutExpanded] = useState(true);
  const animatedHeight = useRef(new Animated.Value(1)).current;

  // 🚀 Smooth expand/collapse animation
  const toggleAbout = () => {
    Animated.timing(animatedHeight, {
      toValue: aboutExpanded ? 0 : 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
    setAboutExpanded(!aboutExpanded);
  };

  const animatedOpacity = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <LinearGradient colors={["#0d001a", "#1a0033"]} style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={26} color="#c77dff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ⚙️ About Card */}
        <LinearGradient
          colors={["#2e005e", "#5e00a3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <TouchableOpacity style={styles.cardHeader} onPress={toggleAbout}>
            <Ionicons name="information-circle-outline" size={22} color="#d9b3ff" />
            <Text style={styles.title}>About Us</Text>
            <Ionicons
              name={aboutExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#d9b3ff"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>

          <Animated.View
            style={{
              overflow: "hidden",
              opacity: animatedOpacity,
              marginTop: aboutExpanded ? 8 : 0,
            }}
          >
            <Text style={styles.text}>
              <Text style={styles.highlight}>Veritas</Text> is an AI-powered misinformation detection and fact-checking platform designed to help users identify and debunk false information circulating across social media and messaging platforms.
            </Text>
            <Text style={styles.text}>
              Our mission is to combat misinformation by providing real-time verification, credibility scoring, and gamified tools that empower users to recognize and report misleading claims. Whether it’s a text, image, video, or deepfake — <Text style={styles.highlight}>Veritas</Text> ensures transparency, trust, and community-driven awareness.
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* 💜 Purple Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.buttonContainer}
          onPress={() => alert("More coming soon 🚀")}
        >
          <LinearGradient
            colors={["#7a00ff", "#b266ff"]}
            style={styles.buttonGradient}
          >
            <Ionicons name="planet-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Explore More</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  backButton: {
    backgroundColor: "rgba(167, 88, 255, 0.1)",
    padding: 6,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 12,
    color: "#fff",
    textShadowColor: "#c77dff",
    textShadowRadius: 10,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#a64dff",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
    color: "#fff",
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: "#ddd",
    marginTop: 10,
  },
  highlight: {
    color: "#c77dff",
    fontWeight: "bold",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: "#a64dff",
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 16,
    textShadowColor: "#fff",
    textShadowRadius: 10,
  },
});
