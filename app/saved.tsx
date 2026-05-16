import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type SavedItem = {
  id: string;
  title: string;
  subtitle: string;
};

export default function SavedPage() {
  const [search, setSearch] = useState("");
  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    { id: "1", title: "Climate change article", subtitle: "Aug 28" },
    { id: "2", title: "Political fact check", subtitle: "Aug 26" },
    { id: "3", title: "Viral tweet verification", subtitle: "Aug 25" },
  ]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  // Animate list on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  // Filter items
  const filteredItems = savedItems.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  // Handle delete
  const handleDelete = (id: string) => {
    Alert.alert("Remove Item", "Do you want to remove this saved item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setSavedItems((prev) => prev.filter((i) => i.id !== id)),
      },
    ]);
  };

  // Render each card
  const renderItem = ({ item }: { item: SavedItem }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.item}
        onPress={() => router.push(`/details/${item.id}`)}
        onLongPress={() => handleDelete(item.id)}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View style={styles.iconContainer}>
            <Ionicons name="bookmark" size={22} color="#a855f7" />
          </View>
        </Animated.View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#b9a8f5" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved</Text>
        <Ionicons name="bookmark" size={22} color="#a855f7" />
      </View>

      {/* Search Bar */}
      <Animated.View
        style={[
          styles.searchWrapper,
          {
            shadowOpacity: searchAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.4],
            }),
          },
        ]}
      >
        <Ionicons name="search" size={18} color="#c8bce6" style={{ marginLeft: 8 }} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search saved items"
          placeholderTextColor="#8b7bbd"
          value={search}
          onFocus={() =>
            Animated.timing(searchAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: false,
            }).start()
          }
          onBlur={() =>
            Animated.timing(searchAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }).start()
          }
          onChangeText={setSearch}
        />
      </Animated.View>

      {/* Saved Items List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bookmark-outline" size={60} color="#7565a8" />
            <Text style={styles.emptyText}>No saved items yet.</Text>
            <Text style={styles.emptySubText}>
              Your saved articles will appear here.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* View All Button */}
      {savedItems.length > 0 && (
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => router.push("/saved/all")}
          activeOpacity={0.9}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0615",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a132b",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#a855f7",
  },
  searchBar: {
    flex: 1,
    fontSize: 14,
    marginLeft: 6,
    color: "#fff",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a132b",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2f2554",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#2a1f45",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  subtitle: {
    fontSize: 13,
    color: "#b9a8f5",
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#d4c8ff",
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 13,
    color: "#9f91d6",
    marginTop: 4,
  },
  viewAllBtn: {
    backgroundColor: "#a855f7",
    padding: 16,
    borderRadius: 12,
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    elevation: 6,
    shadowColor: "#a855f7",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  viewAllText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
