// Components/RatingModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function RatingModal({ visible, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    console.log("⭐ Rating:", rating);
    console.log("📝 Review:", review);
    onClose(); // close after submit
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Rate Your Experience</Text>

          {/* ⭐ Star Rating */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={32}
                  color={star <= rating ? "#facc15" : "#9ca3af"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* 📝 Review Input */}
          <TextInput
            style={styles.input}
            placeholder="Write your review..."
            placeholderTextColor="#9ca3af"
            value={review}
            onChangeText={setReview}
            multiline
          />

          {/* Buttons */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, { opacity: rating === 0 ? 0.5 : 1 }]}
              onPress={handleSubmit}
              disabled={rating === 0}
            >
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 16,
    color: "#111827",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  cancelText: {
    color: "#6b7280",
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: "#111827",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  submitText: {
    color: "white",
    fontWeight: "600",
  },
});
