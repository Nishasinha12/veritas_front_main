import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";

type LogoutModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function LogoutModal({ visible, onClose }: LogoutModalProps) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 🔮 Animation for modal appearance
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleYes = () => {
    onClose();
    router.replace("/"); // Redirect to login/landing page
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.title}>Are you sure you want to log out?</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.yesButton} onPress={handleYes}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.noButton} onPress={onClose}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(10, 10, 20, 0.8)", // darker sci-fi vibe
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7A00FF",
    shadowColor: "#9D4EDD",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E0E0FF",
    marginBottom: 25,
    textAlign: "center",
    textShadowColor: "#A855F7",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  yesButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#C084FC",
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  noButton: {
    backgroundColor: "#9333EA",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#C084FC",
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "#F5F3FF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
