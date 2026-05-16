import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
  Animated,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import apiClient from "../../api/apiClient"; // Make sure this path is correct

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { email } = useLocalSearchParams();

  const glowAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleVerify = async () => {
    if (code.length < 4) {
        Alert.alert("Error", "Please enter the 4-digit code.");
        return;
    }
    setIsLoading(true);
    try {
      await apiClient.post("/verify-otp", { email, otp: code });
      router.push({
        pathname: "/onboarding/reset-password",
        params: { email: email },
      });
    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid or expired code.";
      Alert.alert("Error", message);
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
        await apiClient.post('/forgot-password', { email });
        Alert.alert("Code Resent", "A new verification code has been sent to your email.");
    } catch (error) {
        Alert.alert("Error", "Could not resend the code. Please try again later.");
    } finally {
        setIsResending(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/back_astro.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: glowAnim }] },
          ]}
        >
          <Image
            source={{ uri: "https://img.icons8.com/fluency-systems-filled/96/BB86FC/new-post.png" }}
            style={styles.icon}
          />
        </Animated.View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.text}>
          Please enter the 4-digit code sent to your email.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="----"
          placeholderTextColor="#777"
          keyboardType="numeric"
          maxLength={4}
          value={code}
          onChangeText={setCode}
        />

        <Pressable onPress={handleResend} disabled={isResending}>
          <Text style={styles.resend}>{isResending ? "Sending..." : "Resend Code"}</Text>
        </Pressable>

        <Animated.View
          style={[
            styles.glowButtonWrapper,
            { opacity: glowAnim },
          ]}
        >
          <Pressable
            style={styles.btn}
            onPress={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text style={styles.btnText}>Verify</Text>
            )}
          </Pressable>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0A0016",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  iconContainer: {
    alignSelf: "center",
    marginBottom: 25,
    shadowColor: "#BB86FC",
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  icon: { width: 80, height: 80, tintColor: "#BB86FC" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#BB86FC",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "#9c5dfc",
    textShadowRadius: 10,
  },
  text: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#9c5dfc",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 26,
    letterSpacing: 18,
    backgroundColor: "rgba(20, 0, 40, 0.9)",
    color: "#fff",
    shadowColor: "#9c5dfc",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  resend: {
    color: "#c3a6ff",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  glowButtonWrapper: {
    alignSelf: "center",
    width: "100%",
    shadowColor: "#BB86FC",
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  btn: {
    backgroundColor: "#9c5dfc",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: 'center',
    minHeight: 50, // Ensures consistent button height
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});