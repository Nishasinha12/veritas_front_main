import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Trans, useTranslation } from "react-i18next";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import apiClient from "../../api/apiClient"; // ✅ Ensure this file exists


WebBrowser.maybeCompleteAuthSession();

// --- CONFIGURATION ---
const RECAPTCHA_SITE_KEY = "6LftQvIrAAAAAA1IZqEVISje4RmZWT1xj_B954mL";
// ----------------------

const captchaHtml = `
<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<script>function onSubmit(token){window.ReactNativeWebView.postMessage(token);}</script>
</head>
<body><div style="display:flex;justify-content:center;align-items:center;height:100vh">
<div class="g-recaptcha" data-sitekey="${RECAPTCHA_SITE_KEY}" data-callback="onSubmit"></div>
</div></body></html>
`;

export default function Signin() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [signupData, setSignupData] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟣 LOGIN API
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post("/login", { email, password });
      Alert.alert("Success", res.data.message || "Login successful!");
      router.push("/onboarding/profile1");
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid email or password.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  // 🟣 SIGNUP - trigger CAPTCHA
  const handleCreateAccount = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    setSignupData({ name, email, password });
    setShowCaptcha(true);
  };

  // 🟣 reCAPTCHA + REGISTER
  const handleCaptchaVerify = async (token: string) => {
    console.log("Captcha token received:", token);
    setShowCaptcha(false);
    setLoading(true);
    try {
      const res = await apiClient.post("/register", {
        ...signupData,
        captcha_token: token,
      });
      Alert.alert("Success", res.data.message || "Account created successfully!");
      setActiveTab("signin");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/back_gnd.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* reCAPTCHA Modal */}
        <Modal visible={showCaptcha} transparent onRequestClose={() => setShowCaptcha(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <WebView
                source={{ html: captchaHtml, baseUrl: "http://localhost:8080" }}
                onMessage={(e) => handleCaptchaVerify(e.nativeEvent.data)}
                javaScriptEnabled
                domStorageEnabled
                originWhitelist={["*"]}
              />
            </View>
          </View>
        </Modal>

        <View style={styles.overlay}>
          {/* Title */}
          <Text style={styles.title}>Veritas</Text>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tab, activeTab === "signin" ? styles.activeTab : styles.inactiveTab]}
              onPress={() => setActiveTab("signin")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "signin" ? styles.activeTabText : styles.inactiveTabText,
                ]}
              >
                {t("signin_tab")}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.tab, activeTab === "signup" ? styles.activeTab : styles.inactiveTab]}
              onPress={() => setActiveTab("signup")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "signup" ? styles.activeTabText : styles.inactiveTabText,
                ]}
              >
                {t("create_account_tab")}
              </Text>
            </Pressable>
          </View>

          {/* Forms */}
          {activeTab === "signin" ? (
            <>
              <TextInput
                style={styles.input}
                placeholder={t("email_placeholder")}
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t("password_placeholder")}
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#a855f7" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => router.push("/onboarding/forgot-password")}>
                <Text style={styles.forgotText}>{t("forgot_password")}</Text>
              </TouchableOpacity>

              {loading ? (
                <ActivityIndicator size="large" color="#a855f7" />
              ) : (
                <LinearGradient
                  colors={["#7e22ce", "#a855f7", "#9333ea"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.btn}
                >
                  <Pressable onPress={handleSignIn}>
                    <Text style={styles.btnText}>{t("signin_button")}</Text>
                  </Pressable>
                </LinearGradient>
              )}
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder={t("name_placeholder")}
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder={t("email_placeholder")}
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t("password_placeholder")}
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#a855f7" />
                </TouchableOpacity>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t("confirm_password_placeholder")}
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#a855f7" />
                </TouchableOpacity>
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#a855f7" />
              ) : (
                <LinearGradient
                  colors={["#7e22ce", "#a855f7", "#9333ea"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.btn}
                >
                  <Pressable onPress={handleCreateAccount}>
                    <Text style={styles.btnText}>{t("create_account_button")}</Text>
                  </Pressable>
                </LinearGradient>
              )}
            </>
          )}

          <Text style={styles.termsText}>
            <Trans
              i18nKey="terms_and_policy"
              components={{ 1: <Text style={styles.link} />, 3: <Text style={styles.link} /> }}
            />
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  container: { flex: 1 }, // ✅ Added missing container style
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10,10,25,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: { width: "90%", height: "60%" },
  title: {
    color: "#a855f7",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 30,
    textShadowColor: "rgba(168,85,247,0.7)",
    textShadowRadius: 12,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 30,
    padding: 4,
    marginBottom: 25,
    width: "100%",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#9333ea" },
  inactiveTab: { borderWidth: 1, borderColor: "#a855f7" },
  tabText: { fontSize: 16, fontWeight: "600" },
  activeTabText: { color: "white" },
  inactiveTabText: { color: "#a855f7" },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 12,
    width: "100%",
    marginBottom: 15,
    color: "white",
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.3)",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    paddingRight: 10,
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.3)",
  },
  passwordInput: { flex: 1, padding: 12, color: "white" },
  eyeIcon: { paddingHorizontal: 6 },
  btn: {
    padding: 14,
    borderRadius: 10,
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#a855f7",
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  forgotText: {
    alignSelf: "flex-end",
    color: "#c084fc",
    fontSize: 14,
    marginBottom: 10,
  },
  termsText: { color: "#aaa", fontSize: 13, textAlign: "center" },
  link: { color: "#a855f7" },
});