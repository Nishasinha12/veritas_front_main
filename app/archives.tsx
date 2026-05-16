import { Link, router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
  FlatList,
  Platform,
  ToastAndroid,
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Menu from "../Components/Menu";
import LogoutModal from "../Components/LogoutModal";
import Chatbot from "../Components/Chatbot";

const TRENDING = [
  { id: "t1", title: "Trending news" },
  { id: "t2", title: "Sports news" },
  { id: "t3", title: "Tech news" },
  { id: "t4", title: "More" },
];

interface Post {
  id: string;
  content: string;
  archived: boolean;
}

export default function ArchivesScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      const stored = await AsyncStorage.getItem("user_posts");
      if (stored) {
        setPosts(JSON.parse(stored));
      } else {
        const dummy: Post[] = [
          { id: "1", content: "My first post 🎉", archived: false },
          { id: "2", content: "Vacation 🏖️", archived: true },
          { id: "3", content: "Learning React Native 📱", archived: true },
        ];
        setPosts(dummy);
        await AsyncStorage.setItem("user_posts", JSON.stringify(dummy));
      }
    };
    loadPosts();
  }, []);

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const toggleArchive = async (id: string) => {
    const updated = posts.map((p) =>
      p.id === id ? { ...p, archived: !p.archived } : p
    );
    setPosts(updated);
    await AsyncStorage.setItem("user_posts", JSON.stringify(updated));

    const isUnarchived = updated.find((p) => p.id === id)?.archived === false;
    if (isUnarchived) showToast("✅ Post unarchived successfully!");
    else showToast("📦 Post archived!");
  };

  const archivedPosts = posts.filter((p) => p.archived);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.98, 1],
              }),
            },
          ],
        },
      ]}
    >
      {/* ✅ Top Bar */}
      <View style={styles.topBar}>
        <Ionicons name="home" size={22} color="#bb86fc" />
        <Text style={styles.brand}>Veritas</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            style={{ marginRight: 16 }}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications-outline" size={22} color="#bb86fc" />
          </Pressable>
          <Pressable
            style={{ marginRight: 16 }}
            onPress={() => setMenuVisible(true)}
          >
            <Ionicons name="menu-outline" size={26} color="#bb86fc" />
          </Pressable>
          <Ionicons name="person-circle-outline" size={26} color="#bb86fc" />
        </View>
      </View>

      {/* ✅ List */}
      <FlatList
        data={archivedPosts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
              <Text style={styles.sectionTitle}>Your Archived Posts</Text>
              <Text style={styles.subText}>
                Manage or unarchive your saved posts.
              </Text>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              What do you want to browse?
            </Text>

            <FlatList
              horizontal
              data={TRENDING}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Animated.View
                  style={[styles.trendCard, { transform: [{ scale: 1 }] }]}
                >
                  <Text style={styles.trendTitle}>{item.title}</Text>
                </Animated.View>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              style={{ marginTop: 10 }}
            />

            <View style={styles.divider} />
          </>
        }
        renderItem={({ item }) => (
          <Animated.View style={styles.postCard}>
            <Text style={styles.postText}>{item.content}</Text>
            <Pressable
              style={styles.unarchiveBtn}
              onPress={() => toggleArchive(item.id)}
            >
              <Ionicons
                name="arrow-up-circle-outline"
                size={18}
                color="#fff"
              />
              <Text style={styles.unarchiveText}>Unarchive</Text>
            </Pressable>
          </Animated.View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No archived posts yet</Text>
        }
        ListFooterComponent={
          <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
            <View style={styles.bigCard}>
              <Text style={styles.bigCardTitle}>Keep exploring</Text>
              <Text style={styles.bigCardText}>
                Browse trending news or verify new content anytime.
              </Text>
              <Link href="/compose" asChild>
                <Pressable style={styles.cta}>
                  <Text style={styles.ctaText}>Create new post</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        }
      />

      {/* ✅ Floating Chatbot */}
      <Chatbot />

      {/* ✅ Drawer Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />
          <Menu
            onClose={() => setMenuVisible(false)}
            setShowLogout={setShowLogout}
          />
        </View>
      </Modal>

      {/* ✅ Logout Modal */}
      <LogoutModal visible={showLogout} onClose={() => setShowLogout(false)} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#121212",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#2a2a2a",
  },
  brand: {
    fontSize: 20,
    fontWeight: "700",
    color: "#bb86fc",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#eaeaea",
    marginLeft: 16,
  },
  subText: {
    fontSize: 13,
    color: "#9ca3af",
    marginLeft: 16,
    marginTop: 4,
  },
  trendCard: {
    height: 120,
    width: 140,
    borderRadius: 14,
    backgroundColor: "#1e1e2e",
    borderWidth: 1,
    borderColor: "#3b3b55",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#bb86fc",
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  trendTitle: {
    fontWeight: "700",
    color: "#cfcfff",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#272738",
    marginVertical: 14,
    marginHorizontal: 16,
  },
  postCard: {
    backgroundColor: "#1b1b27",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3b3b55",
    shadowColor: "#bb86fc",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  postText: {
    fontSize: 15,
    color: "#f1f1f1",
    marginBottom: 10,
  },
  unarchiveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7c3aed",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    shadowColor: "#bb86fc",
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  unarchiveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 40,
    fontSize: 14,
  },
  bigCard: {
    backgroundColor: "#1e1e2e",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3b3b55",
    marginBottom: 16,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  bigCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#eaeaea",
    marginBottom: 6,
  },
  bigCardText: {
    color: "#cfcfff",
    marginBottom: 12,
  },
  cta: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#7c3aed",
  },
  ctaText: {
    color: "white",
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
