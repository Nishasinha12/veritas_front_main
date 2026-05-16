// app/user.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { MotiView } from "moti";
import useProfileStore from "../store/useProfileStore"; // ✅ import store

export default function UserPage() {
  const { profile } = useProfileStore();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Avatar Section */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          style={styles.avatarContainer}
        >
          <Image
            source={{
              uri:
                profile.photo ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{profile.name || "Your Name"}</Text>
        </MotiView>

        {/* Info Cards */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 200 }}
        >
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender:</Text>
            <Text style={styles.infoText}>{profile.gender || "Your Gender"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>DOB:</Text>
            <Text style={styles.infoText}>{profile.dob || "Your DOB"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Country:</Text>
            <Text style={styles.infoText}>{profile.country || "Your Country"}</Text>
          </View>
        </MotiView>

        {/* Edit Profile Button */}
        <MotiView
          from={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: 400 }}
        >
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push("/edit-profile")}
            activeOpacity={0.8}
          >
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a", // 🌙 Deep dark background
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#a855f7", // purple accent border
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  infoRow: {
    backgroundColor: "#1e1e2e",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.3)",
  },
  infoLabel: {
    color: "#a78bfa",
    fontWeight: "600",
    fontSize: 15,
  },
  infoText: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "500",
  },
  editBtn: {
    marginTop: 20,
    backgroundColor: "#a855f7", // 💜 purple accent
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  editText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
