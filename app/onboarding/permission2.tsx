import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from 'react-i18next';

export default function Permission2() {
  const { t }=useTranslation();

  const privacyOptions = [
    "share_insights",
   "enable_integration",
  ];

  const permissionOptions = [
    "notifications",
    "media_access",
    "contacts",
  ];

  const [selectedPrivacy, setSelectedPrivacy] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const toggleOption = (option: string, type: "privacy" | "permission") => {
    if (type === "privacy") {
      setSelectedPrivacy((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option]
      );
    } else {
      setSelectedPermissions((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option]
      );
    }
  };

  const toggleAllowAll = () => {
    if (selectedPermissions.length === permissionOptions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissionOptions);
    }
  };
  const isAllSelected = selectedPermissions.length === permissionOptions.length;
  return (
    <ImageBackground
      source={require("../../assets/bg1.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>{t('permissions_privacy_title')}</Text>

        {/* Privacy Section */}
        {privacyOptions.map((pkey, i) => (
          <Pressable
            key={i}
            style={styles.optionRow}
            onPress={() => toggleOption(pkey, "privacy")}
          >
            <Ionicons
              name={selectedPrivacy.includes(pkey) ? "checkbox" : "square-outline"}
              size={22}
              color="#B794F4"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.optionText}>{t(`privacy_${pkey}`)}</Text>
          </Pressable>
        ))}

        {/* Permissions Section */}
        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>{t('permissions_permissions_title')}</Text>
        {permissionOptions.map((pkey, i) => (
          <Pressable
            key={i}
            style={styles.optionRow}
            onPress={() => toggleOption(pkey, "permission")}
          >
            <Ionicons
              name={
                selectedPermissions.includes(pkey)
                  ? "checkbox"
                  : "square-outline"
              }
              size={22}
              color="#B794F4"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.optionText}>{t(`permission_${pkey}`)}</Text>
          </Pressable>
        ))}

        {/* Allow All */}
        <Pressable style={styles.optionRow} onPress={toggleAllowAll}>
          <Ionicons
            name={isAllSelected ? "checkbox" : "square-outline"}
            size={22}
            color="#B794F4"
            style={{ marginRight: 10 }}
          />
          <Text style={[styles.optionText, { fontWeight: "600" }]}>
            {t('permissions_allow_all')}
          </Text>
        </Pressable>

        {/* Gradient Button (no animation) */}
        <Pressable onPress={() => router.push("/home")}>
          <LinearGradient
            colors={["#7b2ff7", "#f107a3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBtn}
          >
            <Text style={styles.btnText}>{t('profile1_save_button')}</Text>
          </LinearGradient>
        </Pressable>
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
    backgroundColor: "rgba(10, 0, 25, 0.75)",
    padding: 24,
  },
  title: {
    color: "#E9D5FF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
    textShadowColor: "#A855F7",
    textShadowRadius: 20,
  },
  sectionTitle: {
    color: "#C084FC",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  optionText: {
    color: "#EDE9FE",
    fontSize: 16,
  },
  gradientBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginTop: 40,
    shadowColor: "#f107a3",
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
}); 