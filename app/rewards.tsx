import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useProfileStore from "../store/useProfileStore";
import usePointsStore from "../store/usePointsStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LeaderboardItem = {
  id: string;
  name: string;
  points: number;
};

type Badge = {
  id: string;
  image: any;
};

const RewardsPage: React.FC = () => {
  const { profile } = useProfileStore();
  const { name, photo } = profile;

  const [badges, setBadges] = useState<Badge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { points, searchCount } = usePointsStore();


  useEffect(() => {
    setBadges([
      { id: "1", image: require("../assets/badge1.jpg") },
      { id: "2", image: require("../assets/badge2.jpg") },
      { id: "3", image: require("../assets/badge3.jpg") },
      { id: "4", image: require("../assets/badge4.jpg") },
    ]);


    // 🔮 Badge pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // ✨ Fade in leaderboard
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [name]);

  useEffect(() => {
  const syncLeaderboard = async () => {
    try {
      // save current user
      const myEntry = {
        name: profile?.name || "You",
        points: points,
        updatedAt: Date.now(),
      };

      await AsyncStorage.setItem(
        `leaderboard_${profile?.name || "anonymous"}`,
        JSON.stringify(myEntry)
      );

      // load all leaderboard entries
      const allKeys = await AsyncStorage.getAllKeys();

      const lbKeys = allKeys.filter((k) =>
        k.startsWith("leaderboard_")
      );

      const entries = await AsyncStorage.multiGet(lbKeys);

      const parsed = entries
        .map(([, val]) => (val ? JSON.parse(val) : null))
        .filter(Boolean)
        .sort((a, b) => b.points - a.points)
        .map((item, i) => ({
          id: String(i + 1),
          ...item,
        }));

      // fallback demo users
      const statics = [
        { id: "s1", name: "ALICE", points: 2000 },
        { id: "s2", name: "BOB", points: 1800 },
        { id: "s3", name: "CHARLIE", points: 1600 },
      ];

      const combined = [...parsed, ...statics]
        .sort((a, b) => b.points - a.points)
        .slice(0, 10);

      setLeaderboard(combined);
    } catch (err) {
      console.log("Leaderboard sync failed:", err);
    }
  };

  syncLeaderboard();
}, [points, profile?.name]);

  const renderLeaderboard = ({
    item,
    index,
  }: {
    item: LeaderboardItem;
    index: number;
  }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      }}
    >
      <View style={styles.leaderboardRow}>
        <Text style={styles.rankText}>#{index + 1}</Text>
        <Text
          style={[
            styles.name,
            item.name === (name || "You") && styles.youHighlight,
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.points,
            item.name === (name || "You") && styles.youHighlight,
          ]}
        >
          {item.points} pts
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <LinearGradient colors={["#0d0d0d", "#1a0033"]} style={styles.container}>
      {/* 👤 Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          {photo ? (
            <Image
              source={{ uri: photo }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          ) : (
            <Ionicons name="person-circle" size={80} color="#a64dff" />
          )}
        </View>

        <Text style={styles.username}>{name || "Mr. Explore"}</Text>
        <Text style={styles.level}>LEVEL 12</Text>

        {/* 🌌 Stats Row */}
        <View style={styles.statsRow}>
          <LinearGradient colors={["#2e005e", "#6a0dad"]} style={styles.statBox}>
            <Text style={styles.statValue}>{searchCount}</Text>
<Text style={styles.statLabel}>Searches</Text>
          </LinearGradient>
          <LinearGradient colors={["#2e005e", "#6a0dad"]} style={styles.statBox}>
            <Text style={styles.statValue}>Gold</Text>
            <Text style={styles.statLabel}>League</Text>
          </LinearGradient>
          <LinearGradient colors={["#2e005e", "#6a0dad"]} style={styles.statBox}>
            <Text style={styles.statValue}>{(points / 1000).toFixed(1)}K</Text>
            <Text style={styles.statLabel}>Coins</Text>
          </LinearGradient>
        </View>
      </View>

      {/* 🛡️ Badges */}
      <Text style={styles.sectionTitle}>Badges</Text>
      <View style={styles.badgesRow}>
        {badges.map((badge) => (
          <Animated.View
            key={badge.id}
            style={[styles.badge, { transform: [{ scale: pulseAnim }] }]}
          >
            <Image
              source={badge.image}
              style={{ width: 40, height: 40, resizeMode: "contain" }}
            />
          </Animated.View>
        ))}
      </View>

      {/* 🏆 Leaderboard */}
      <Text style={styles.sectionTitle}>Leaderboard</Text>
      <View style={styles.leaderboardList}>
        <FlatList
          data={leaderboard}
          renderItem={renderLeaderboard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </LinearGradient>
  );
};

export default RewardsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    marginBottom: 10,
    shadowColor: "#a64dff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },
  username: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  level: {
    color: "#c77dff",
    fontSize: 14,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  statBox: {
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    color: "#bbb",
    fontSize: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },
  badge: {
    backgroundColor: "#1f003d",
    padding: 14,
    borderRadius: 50,
    marginHorizontal: 6,
    shadowColor: "#a64dff",
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  leaderboardList: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 10,
  },
  leaderboardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  rankText: {
    color: "#c77dff",
    fontWeight: "700",
  },
  name: {
    color: "#fff",
    flex: 1,
    textAlign: "center",
    fontSize: 16,
  },
  points: {
    color: "#c77dff",
    fontWeight: "bold",
  },
  youHighlight: {
    color: "#d58cff",
  },
});
