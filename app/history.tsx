import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type HistoryItem = {
  id: string;
  title: string;
  subtitle: string;
  status: "true" | "false" | "pending";
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: "1", title: "Fact checked: Climate change news", subtitle: "Aug 29", status: "true" },
    { id: "2", title: "Verified: Viral tweet", subtitle: "Aug 25", status: "false" },
    { id: "3", title: "Checked: Political claim", subtitle: "Aug 21", status: "pending" },
  ]);

  const [filter, setFilter] = useState<"all" | "true" | "false" | "pending">("all");
  const [showFilter, setShowFilter] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const modalSlide = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  const filteredHistory =
    filter === "all" ? history : history.filter((item) => item.status === filter);

  // Fade in list animation
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [filter, history]);

  // Modal slide animation
  useEffect(() => {
    Animated.timing(modalSlide, {
      toValue: showFilter ? 1 : 0,
      duration: 400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [showFilter]);

  const clearHistory = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setHistory([]));
  };

  const getStatusDetails = (status: "true" | "false" | "pending") => {
    switch (status) {
      case "true":
        return { color: "#81FF98", icon: "checkmark-circle", label: "True" };
      case "false":
        return { color: "#FF5D73", icon: "close-circle", label: "False" };
      case "pending":
        return { color: "#FFD56B", icon: "time", label: "Pending" };
      default:
        return { color: "#ccc", icon: "help-circle", label: "Unknown" };
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const { color, icon, label } = getStatusDetails(item.status);
    return (
      <Animated.View style={{ transform: [{ scale: fadeAnim }], opacity: fadeAnim }}>
        <Pressable
          onPressIn={() =>
            Animated.spring(pressAnim, { toValue: 0.97, useNativeDriver: true }).start()
          }
          onPressOut={() =>
            Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true }).start()
          }
        >
          <Animated.View
            style={[
              styles.item,
              {
                transform: [{ scale: pressAnim }],
                backgroundColor: "#1a1525",
                borderColor: "#2e2154",
                borderWidth: 1,
              },
            ]}
          >
            <Ionicons name={icon as any} size={26} color={color} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: color + "33" }]}>
              <Text style={[styles.badgeText, { color }]}>{label}</Text>
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <TouchableOpacity onPress={() => setShowFilter(true)} style={styles.iconBtn}>
          <Ionicons name="filter-outline" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Sub-header */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Claims verified in last 30 days</Text>
      </View>

      {/* Animated List */}
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              }),
            },
          ],
        }}
      >
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/4076/4076509.png",
                }}
                style={styles.emptyImage}
              />
              <Text style={styles.emptyText}>No history found</Text>
              <Text style={styles.emptySubText}>Start verifying claims to see them here.</Text>
            </View>
          }
        />
      </Animated.View>

      {/* Clear button */}
      {history.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={clearHistory}>
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.clearBtnText}>Clear History</Text>
        </TouchableOpacity>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        transparent
        animationType="none"
        onRequestClose={() => setShowFilter(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowFilter(false)}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  {
                    translateY: modalSlide.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
                opacity: modalSlide,
              },
            ]}
          >
            <Text style={styles.modalTitle}>Filter by Status</Text>
            {["all", "true", "false", "pending"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.filterOption, filter === option && styles.filterSelected]}
                onPress={() => {
                  setFilter(option as any);
                  setShowFilter(false);
                }}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === option && styles.filterTextSelected,
                  ]}
                >
                  {option === "all"
                    ? "All"
                    : option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0615",
    paddingHorizontal: 18,
    paddingTop: 55,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
  },
  subHeader: {
    backgroundColor: "#17112b",
    padding: 10,
    borderRadius: 10,
    marginBottom: 18,
  },
  subHeaderText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#c8bce6",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 13,
    color: "#c8bce6",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    opacity: 0.8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  emptySubText: {
    fontSize: 13,
    color: "#a9a2c1",
    marginTop: 4,
  },
  clearBtn: {
    flexDirection: "row",
    backgroundColor: "#a855f7",
    padding: 14,
    borderRadius: 10,
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    shadowColor: "#a855f7",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  clearBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#1a132b",
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 18,
  },
  filterOption: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#322a56",
  },
  filterSelected: {
    backgroundColor: "#2a2045",
    borderRadius: 8,
  },
  filterText: {
    fontSize: 16,
    color: "#ccc",
  },
  filterTextSelected: {
    color: "#a855f7",
    fontWeight: "600",
  },
});
