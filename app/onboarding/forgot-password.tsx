import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ImageBackground,
  Animated,
  Easing,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import apiClient from "../../api/apiClient"; // Make sure this path is correct

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Sci-Fi Fade-In Animation ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSend = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.post("/forgot-password", { email });
      Alert.alert("Check Your Email",`An OTP has been sent to ${email}.`);
      router.push({
        pathname: "/onboarding/verify-email",
        params: { email: email },
      });
    } catch (error: any) {
      const message = error.response?.data?.message || "Could not send OTP. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <ImageBackground
      source={require("../../assets/bg1.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Lock Icon */}
          <Image
            source={{
              uri: "https://img.icons8.com/ios-filled/100/a855f7/lock--v1.png",
            }}
            style={styles.icon}
          />

          {/* Title */}
          <Text style={styles.title}>Forgot Password</Text>

          {/* Subtitle */}
          <Text style={styles.text}>
            Please enter your email address to receive a verification code.
          </Text>

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#bbb"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Try another way */}
          <Pressable>
            <Text style={styles.link}>Try another way</Text>
          </Pressable>

          {/* Send Button */}
          <Pressable
            style={styles.btn}
            onPress={handleSend}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnText}>Send</Text>
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
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10, 10, 25, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(20, 20, 40, 0.9)",
    borderRadius: 16,
    padding: 24,
    alignItems: 'center', // Added for better centering of elements
    shadowColor: "#a855f7",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
    color: "#c084fc",
    textShadowColor: "#a855f7",
    textShadowRadius: 10,
  },
  text: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: '100%', // Ensure input takes full width of card
    borderWidth: 1.5,
    borderColor: "#a855f7",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "white",
  },
  link: {
    textAlign: "center",
    color: "#c084fc",
    marginBottom: 20,
    fontWeight: "500",
    textShadowColor: "#a855f7",
    textShadowRadius: 8,
  },
  btn: {
    width: '100%', // Ensure button takes full width of card
    backgroundColor: "#a855f7",
    padding: 14,
    borderRadius: 10,
    shadowColor: "#a855f7",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    textShadowColor: "#7e22ce",
    textShadowRadius: 8,
  },
});