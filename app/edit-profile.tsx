import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useProfileStore from "../store/useProfileStore";

export default function EditProfilePage() {
  const { profile, updateProfile } = useProfileStore();

  const [nameState, setNameState] = useState(profile?.name ?? "");
  const [emailState, setEmailState] = useState(profile?.email ?? "");
  const [dobState, setDobState] = useState(profile?.dob ?? "");
  const [genderState, setGenderState] = useState(profile?.gender ?? "");
  const [countryState, setCountryState] = useState(profile?.country ?? "");
  const [avatarState, setAvatarState] = useState(profile?.photo ?? null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // ⚡ Animation for avatar pulse
  const avatarScale = new Animated.Value(1);
  const pulse = () => {
    Animated.sequence([
      Animated.timing(avatarScale, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(avatarScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
    ]).start();
  };

  // 📸 Pick Image
  const pickImage = async () => {
    pulse();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setAvatarState(result.assets[0].uri);
    }
  };

  // 📅 Handle Date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      setDobState(dateStr);
    }
  };

  // 💾 Save changes
  const handleSave = () => {
    updateProfile({
      name: nameState,
      email: emailState,
      dob: dobState,
      gender: genderState,
      country: countryState,
      photo: avatarState,
    });
    Alert.alert("✅ Success", "Profile updated successfully!");
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Avatar Picker */}
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        <Animated.Image
          source={{
            uri:
              avatarState ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={[styles.avatar, { transform: [{ scale: avatarScale }] }]}
        />
        <Text style={styles.changeText}>Change Photo</Text>
      </TouchableOpacity>

      {/* Name Input */}
      <View style={styles.inputRow}>
        <Ionicons name="person" size={20} color="#a78bfa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#9ca3af"
          value={nameState}
          onChangeText={setNameState}
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputRow}>
        <Ionicons name="mail" size={20} color="#a78bfa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          value={emailState}
          onChangeText={setEmailState}
        />
      </View>

      {/* DOB */}
      <View style={styles.inputRow}>
        <Ionicons name="calendar" size={20} color="#a78bfa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Date of Birth"
          placeholderTextColor="#9ca3af"
          value={dobState}
          editable={false}
        />
        <Pressable onPress={() => setShowDatePicker(true)}>
          <Ionicons name="chevron-down" size={20} color="#a78bfa" />
        </Pressable>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dobState ? new Date(dobState) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      {/* Gender */}
      <View style={styles.inputRow}>
        <Ionicons name="male-female" size={20} color="#a78bfa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Gender"
          placeholderTextColor="#9ca3af"
          value={genderState}
          editable={false}
        />
        <Pressable onPress={() => setShowGenderDropdown(!showGenderDropdown)}>
          <Ionicons
            name={showGenderDropdown ? "chevron-up" : "chevron-down"}
            size={20}
            color="#a78bfa"
          />
        </Pressable>
      </View>

      {showGenderDropdown && (
        <View style={styles.dropdown}>
          {["Male", "Female", "Other"].map((item) => (
            <Pressable
              key={item}
              onPress={() => {
                setGenderState(item);
                setShowGenderDropdown(false);
              }}
            >
              <Text style={styles.dropdownItem}>{item}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Country */}
      <View style={styles.inputRow}>
        <Ionicons name="earth" size={20} color="#a78bfa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Country"
          placeholderTextColor="#9ca3af"
          value={countryState}
          editable={false}
        />
        <Pressable onPress={() => setShowCountryDropdown(!showCountryDropdown)}>
          <Ionicons
            name={showCountryDropdown ? "chevron-up" : "chevron-down"}
            size={20}
            color="#a78bfa"
          />
        </Pressable>
      </View>

      {showCountryDropdown && (
        <View style={styles.dropdown}>
          {["India", "USA", "UK", "Canada", "Australia"].map((item) => (
            <Pressable
              key={item}
              onPress={() => {
                setCountryState(item);
                setShowCountryDropdown(false);
              }}
            >
              <Text style={styles.dropdownItem}>{item}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Save Button with glow animation */}
      <TouchableOpacity activeOpacity={0.9} onPress={handleSave}>
        <LinearGradient
          colors={["#7e22ce", "#9333ea", "#a855f7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.saveBtn}
        >
          <Text style={styles.saveText}>Save</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f17",
    padding: 20,
  },
  avatarContainer: { alignItems: "center", marginBottom: 24 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#a78bfa",
    marginBottom: 8,
  },
  changeText: { color: "#a78bfa", fontWeight: "600" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e2e",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#f1f5f9",
  },
  dropdown: {
    backgroundColor: "#1e1e2e",
    borderRadius: 10,
    marginBottom: 12,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: "#e2e8f0",
    fontSize: 15,
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#a855f7",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
    marginTop: 20,
  },
  saveText: { color: "white", fontWeight: "700", fontSize: 16 },
});
