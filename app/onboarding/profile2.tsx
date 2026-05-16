import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile2() {
  const identities = [
    "General User",
    "Journalist",
    "Researcher",
    "Student / Learner",
    "Policy/Fact-checker",
    "Other",
  ];

  const topics = [
    "Economy and business",
    "Politics",
    "Health & Science",
    "Environment",
    "Entertainment",
    "Global Events",
    "Other Interests",
  ];

  const [selectedIdentity, setSelectedIdentity] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  // 🔮 Sci-fi glow animation
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#7b2ff7", "#f107a3"], // pulsating neon purple-pink glow
  });

  return (
    <ImageBackground
      source={require("../../assets/bg1.jpg")} // 🌌 Sci-fi bg
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Identity Section */}
          <Text style={styles.title}>How do you identify?</Text>
          {identities.map((id, i) => (
            <Pressable
              key={i}
              style={[
                styles.optionRow,
                selectedIdentity === id && styles.selectedOption,
              ]}
              onPress={() => setSelectedIdentity(id)}
            >
              <Ionicons
                name={
                  selectedIdentity === id
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={22}
                color={selectedIdentity === id ? "#a85fff" : "#bbb"}
                style={{ marginRight: 10 }}
              />
              <Text
                style={[
                  styles.optionText,
                  selectedIdentity === id && { color: "#a85fff" },
                ]}
              >
                {id}
              </Text>
            </Pressable>
          ))}

          {/* Topics Section */}
          <Text style={styles.subtitle}>Choose topics you care about</Text>
          {topics.map((t, i) => (
            <Pressable
              key={i}
              style={[
                styles.optionRow,
                selectedTopics.includes(t) && styles.selectedOption,
              ]}
              onPress={() => toggleTopic(t)}
            >
              <Ionicons
                name={
                  selectedTopics.includes(t)
                    ? "checkmark-circle"
                    : "ellipse-outline"
                }
                size={22}
                color={selectedTopics.includes(t) ? "#a85fff" : "#bbb"}
                style={{ marginRight: 10 }}
              />
              <Text
                style={[
                  styles.optionText,
                  selectedTopics.includes(t) && { color: "#a85fff" },
                ]}
              >
                {t}
              </Text>
            </Pressable>
          ))}

          {/* Animated Save Button */}
          <Animated.View
            style={[
              styles.glowWrapper,
              { shadowColor: glowInterpolation },
            ]}
          >
            <LinearGradient
              colors={["#7b2ff7", "#f107a3"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btn}
            >
              <Pressable onPress={() => router.push("/onboarding/permission2")}>
                <Text style={styles.btnText}>Save & Continue </Text>
              </Pressable>
            </LinearGradient>
          </Animated.View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10, 0, 25, 0.65)", // deep violet overlay
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    color: "#e0d8ff",
    fontSize: 22,
    marginBottom: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: "#e0d8ff",
    fontSize: 20,
    marginTop: 25,
    marginBottom: 15,
    fontWeight: "600",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(168,95,255,0.2)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: "rgba(168,95,255,0.15)",
    borderColor: "#a85fff",
  },
  optionText: {
    color: "white",
    fontSize: 16,
    flexShrink: 1,
  },
  glowWrapper: {
    width: "100%",
    borderRadius: 10,
    shadowOpacity: 0.9,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    marginTop: 30,
  },
  btn: {
    padding: 15,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
