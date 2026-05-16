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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";

import Menu from "../Components/Menu";
import LogoutModal from "../Components/LogoutModal";
import RatingModal from "../Components/RatingModal";
import Chatbot from "../Components/Chatbot";
import useProfileStore from "../store/useProfileStore";
import usePointsStore from "../store/usePointsStore";

const CATEGORIES = [
  { id: "c1", title: "Trending", icon: "flame-outline", color: "#8A2BE2" },
  { id: "c2", title: "Sports", icon: "football-outline", color: "#7B68EE" },
  { id: "c3", title: "Technology", icon: "hardware-chip-outline", color: "#9370DB" },
  { id: "c4", title: "Entertainment", icon: "film-outline", color: "#9B59B6" },
  { id: "c5", title: "Science", icon: "planet-outline", color: "#663399" },
];

interface Post {
  id: string;
  content: string;
  archived: boolean;
  isNews?: boolean;
  originalNewsItem?: any;
}

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newsHeadlines, setNewsHeadlines] = useState<any[]>([]);
  const [combinedFeed, setCombinedFeed] = useState<Post[]>([]);
  const [showRating, setShowRating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { profile } = useProfileStore();
  const { feedPosts } = usePointsStore();

  useEffect(() => {
    const loadPosts = async () => {
      const stored = await AsyncStorage.getItem("user_posts");
      if (stored) {
        setPosts(JSON.parse(stored));
      } else {
        const dummy: Post[] = [
          { id: "1", content: "Breaking: New AI tech trends 🤖", archived: false },
          { id: "2", content: "Sports update: Underdog victory 🏆", archived: false },
          { id: "3", content: "Community thoughts: React Native tips 📱", archived: false },
        ];
        setPosts(dummy);
        await AsyncStorage.setItem("user_posts", JSON.stringify(dummy));
      }
    };
    loadPosts();
  }, []);

  const fetchNewsHeadlines = async () => {
    try {                                          // ✅ curly brace, not colon
      const BASE_URL = __DEV__
        ? "http://192.168.43.63:5000"
        : "https://your-production-api.com";

      const response = await fetch(`${BASE_URL}/api/v1/news`);
      const json = await response.json();
      console.log("NEWS RESPONSE:", JSON.stringify(json).slice(0, 200));

      if (json.articles) {
        setNewsHeadlines(json.articles);
      }
    } catch (error) {                             // ✅ curly brace
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNewsHeadlines();
  }, []);

  useEffect(() => {
    const newsPosts = newsHeadlines.map((newsItem, index) => ({
      id: `news-${index}`,
      content: newsItem.title,
      archived: false,
      isNews: true,
      originalNewsItem: newsItem,
    }));

    // verification posts from ResultScreen
    const userVerifiedPosts = feedPosts.map((fp) => ({
      id: fp.id,
      content: fp.content,
      archived: fp.archived,
      isNews: false,
    }));

    // combine everything
    const merged = [
      ...userVerifiedPosts,
      ...posts,
      ...newsPosts,
    ];

    setCombinedFeed(merged);
  }, [newsHeadlines, posts, feedPosts]);

  const toggleArchive = async (id: string) => {
    const updated = posts.map((p) =>
      p.id === id ? { ...p, archived: !p.archived } : p
    );
    setPosts(updated);
    await AsyncStorage.setItem("user_posts", JSON.stringify(updated));
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowRating(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryPress = (categoryId: string) => {
    setActiveCategory(categoryId);
    router.push(`/category/${categoryId}`);
    setTimeout(() => setActiveCategory(null), 400);
  };

  const renderNewsHeadlines = () => (
    <View style={styles.horizontalNewsContainer}>
      <FlatList
        data={newsHeadlines}
        horizontal
        keyExtractor={(item, index) => item.url || index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.newsStoryBox}>
            {item.urlToImage ? (
              <Image
                source={{ uri: item.urlToImage }}
                style={styles.newsStoryImage}
              />
            ) : (
              <View style={styles.newsStoryImagePlaceholder} />
            )}
            <Text
              style={styles.newsStoryTitle}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#BBB", marginTop: 12 }}>
            No news available
          </Text>
        }
      />
    </View>
  );

  const renderHeader = () => (
    <>
      <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }}>
        <LinearGradient
          colors={["#0a0a19", "#0a0a19"]}  // ✅ flat dark like signin
          style={styles.topBar}
        >
          <Image
            source={require("../assets/logo2.png")}
            style={{ width: 100, height: 45 }}
            resizeMode="contain"
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* ✅ Removed Call Icon */}

            {/* Notifications Icon */}
            <Pressable style={{ marginRight: 16 }} onPress={() => router.push("/notifications")}>
              <Ionicons name="notifications-outline" size={22} color="#EAEAEA" />
            </Pressable>

            {/* Menu Icon */}
            <Pressable style={{ marginRight: 16 }} onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu-outline" size={26} color="#EAEAEA" />
            </Pressable>

            {/* Avatar */}
            <Image
              source={{
                uri: profile?.photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              }}
              style={styles.avatar}
            />
          </View>
        </LinearGradient>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500, delay: 200 }}
      >
        <Pressable style={styles.writeRow} onPress={() => router.push("/compose")}>
          <Ionicons name="create-outline" size={18} color="#B197FC" />
          <Text style={{ color: "#D1C4E9", marginLeft: 8 }}>What do you want to verify today?</Text>
        </Pressable>
      </MotiView>

      {renderNewsHeadlines()}

      <Text style={styles.sectionTitle}>Browse Categories</Text>
      {/* ✅ Improved smoothness here */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        scrollEventThrottle={16}
        decelerationRate="fast"
        initialNumToRender={5}
        windowSize={3}
        maxToRenderPerBatch={5}
        renderItem={({ item }) => {
          const isActive = activeCategory === item.id;
          return (
            <Pressable
              onPress={() => handleCategoryPress(item.id)}
              onPressIn={() => setActiveCategory(item.id)}
              onPressOut={() => setActiveCategory(null)}
            >
              <MotiView
                from={{ scale: 0.95, opacity: 0 }}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  opacity: 1,
                }}
                transition={{ type: "timing", duration: 150 }}
                style={[styles.categoryPill, { backgroundColor: item.color }]}
              >
                <Ionicons name={item.icon as any} size={20} color="white" />
                <Text style={styles.categoryLabel}>{item.title}</Text>
              </MotiView>
            </Pressable>
          );
        }}
      />

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Trending News & Community Posts</Text>
      <Text style={styles.subText}>The more you engage, the more your posts get seen 👀</Text>
    </>
  );

  const renderFooter = () => (
    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 600 }}>
      <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
        <View style={styles.bigCard}>
          <Text style={styles.bigCardTitle}>⭐ Stay Active</Text>
          <Text style={styles.bigCardText}>Interact more to climb the community spotlight!</Text>
          <Link href="/compose" asChild>
            <Pressable style={styles.cta}>
              <Text style={styles.ctaText}>Create Post</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </MotiView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0f0f1a" }}>
      <FlatList
        data={combinedFeed.filter((p) => !p.archived)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.isNews) {
            const news = item.originalNewsItem;
            return (
              <View style={styles.postCard}>
                <Text style={styles.postText}>{news.title}</Text>
                {news.urlToImage && (
                  <Image
                    source={{ uri: news.urlToImage }}
                    style={{ height: 150, borderRadius: 8, marginTop: 8 }}
                    resizeMode="cover"
                  />
                )}
                <Text style={{ color: "#7B68EE", marginTop: 6 }}>{news.source.name}</Text>
              </View>
            );
          } else {
            return (
              <View style={styles.postCard}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{
                      uri: profile?.photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                    }}
                    style={styles.postAvatar}
                  />
                  <Text style={styles.postUser}>{profile?.name || "CommunityUser"}</Text>
                </View>
                <Text style={styles.postText}>{item.content}</Text>
                <View style={styles.postActions}>
                  <Pressable>
                    <Ionicons name="heart-outline" size={20} color="#9B59B6" />
                  </Pressable>
                  <Pressable style={{ marginLeft: 16 }}>
                    <Ionicons name="chatbubble-outline" size={20} color="#8A2BE2" />
                  </Pressable>
                  <Pressable style={{ marginLeft: "auto" }} onPress={() => toggleArchive(item.id)}>
                    <Ionicons name="archive-outline" size={20} color="#EAEAEA" />
                  </Pressable>
                </View>
              </View>
            );
          }
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 10, color: "#AAA" }}>No posts yet</Text>
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <Chatbot />

      <Modal visible={menuVisible} transparent animationType="slide" onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.overlay}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setMenuVisible(false)} />
          <Menu onClose={() => setMenuVisible(false)} setShowLogout={setShowLogout} />
        </View>
      </Modal>

      <LogoutModal visible={showLogout} onClose={() => setShowLogout(false)} />
      <RatingModal visible={showRating} onClose={() => setShowRating(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,              // ✅ subtle separator
    borderBottomColor: "#2E2E3A",     // ✅ matches card borders
  },
  brand: {
    fontSize: 22,
    fontWeight: "700",
    color: "#a855f7", // ✅ purple like signin page title
    letterSpacing: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#B197FC",
  },
  writeRow: {
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#2E2E3A",
    borderRadius: 12,
    backgroundColor: "#1C1C2A",
    flexDirection: "row",
    alignItems: "center",
  },
  horizontalNewsContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingLeft: 8,
    marginBottom: 2,
  },
  newsStoryBox: {
    width: 120,
    alignItems: "center",
    backgroundColor: "#26243A",
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#2E2E3A",
  },
  newsStoryImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom: 6,
  },
  newsStoryImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: "#8882",
  },
  newsStoryTitle: {
    color: "#EAEAEA",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 100,
  },
  sectionTitle: {
    marginTop: 6,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#EAEAEA",
  },
  subText: {
    marginLeft: 16,
    color: "#B197FC",
    fontSize: 13,
    marginBottom: 10,
  },
  categoryScroll: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  categoryLabel: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 15,
  },
  postCard: {
    backgroundColor: "#1C1C2A",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2E2E3A",
    shadowColor: "#8A2BE2",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  postAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  postUser: { fontWeight: "600", fontSize: 14, color: "#DADADA" },
  postText: { fontSize: 15, marginVertical: 10, color: "#EAEAEA" },
  postActions: { flexDirection: "row", alignItems: "center" },
  bigCard: {
    backgroundColor: "#1C1C2A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2E2E3A",
    marginBottom: 16,
  },
  bigCardTitle: { fontSize: 18, fontWeight: "700", color: "#EAEAEA" },
  bigCardText: { color: "#B8B8B8", marginBottom: 12 },
  cta: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#8A2BE2",
  },
  ctaText: { color: "white", fontWeight: "600" },
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});
