import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Pressable,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient"; // ✅ Added for gradient header

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  type?: "alert" | "info" | "tip";
  dateGroup: "Today" | "Yesterday" | "Earlier";
};

const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Potential Misinformation Detected",
    body: "We found likely misinformation in a message you flagged.",
    time: "10:24 AM",
    unread: true,
    type: "alert",
    dateGroup: "Today",
  },
  {
    id: "n2",
    title: "Verification Complete",
    body: "Claim you reported was verified — outcome: PARTLY TRUE.",
    time: "Yesterday",
    unread: true,
    type: "info",
    dateGroup: "Yesterday",
  },
  {
    id: "n3",
    title: "New Feature: Image Verification",
    body: "You can now verify images inside the app.",
    time: "2 days ago",
    unread: false,
    type: "tip",
    dateGroup: "Earlier",
  },
  {
    id: "n4",
    title: "Weekly Summary",
    body: "You reviewed 7 items this week. Keep it up!",
    time: "Sep 28",
    unread: false,
    type: "info",
    dateGroup: "Earlier",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const grouped = ["Today", "Yesterday", "Earlier"].map((group) => ({
    title: group,
    data: notifications.filter((n) => n.dateGroup === group),
  }));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const removeNotification = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const openNotification = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    Alert.alert(item.title, item.body);
  };

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const clearAll = () =>
    Alert.alert("Clear notifications", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => setNotifications([]) },
    ]);

  // Swipeable row
  const SwipeableRow = ({ children, onDismiss, id }: any) => {
    const translateX = useSharedValue(0);
    const rowHeight = useSharedValue(1);

    const pan = Gesture.Pan()
      .onUpdate((e) => {
        translateX.value = e.translationX;
      })
      .onEnd(() => {
        if (translateX.value < -120) {
          translateX.value = withTiming(-500, { duration: 200 }, () => {
            runOnJS(onDismiss)(id);
          });
          rowHeight.value = withTiming(0, { duration: 200 });
        } else {
          translateX.value = withTiming(0);
        }
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    const heightStyle = useAnimatedStyle(() => ({
      height: rowHeight.value === 0 ? 0 : withTiming(80),
      marginBottom: rowHeight.value === 0 ? 0 : 10,
      opacity: rowHeight.value,
    }));

    return (
      <Animated.View style={heightStyle}>
        <GestureDetector gesture={pan}>
          <Animated.View style={animatedStyle}>{children}</Animated.View>
        </GestureDetector>
      </Animated.View>
    );
  };

  const renderItem = ({ item, index }: { item: NotificationItem; index: number }) => {
    const icon =
      item.type === "alert"
        ? "alert-circle"
        : item.type === "tip"
        ? "bulb"
        : "information-circle";

    const bg = item.unread ? styles.cardUnread : styles.card;

    return (
      <SwipeableRow id={item.id} onDismiss={removeNotification}>
        <MotiView
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300, delay: index * 120 }}
        >
          <Pressable onPress={() => openNotification(item)} style={[styles.row, bg]}>
            <View style={styles.iconWrap}>
              <Ionicons
                name={icon as any}
                size={22}
                color={item.unread ? "#fff" : "#A78BFA"}
              />
            </View>

            <View style={styles.content}>
              <View style={styles.rowTop}>
                <Text style={[styles.title, item.unread && styles.titleUnread]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.body} numberOfLines={2}>
                {item.body}
              </Text>
            </View>

            {item.unread && <View style={styles.unreadDot} />}
          </Pressable>
        </MotiView>
      </SwipeableRow>
    );
  };

  const renderSectionHeader = ({ section: { title, data } }: any) =>
    data.length > 0 ? <Text style={styles.sectionHeader}>{title}</Text> : null;

  return (
    <View style={styles.screen}>
      {/* ✅ Gradient Header (matches Veritas Home Page) */}
      <LinearGradient
        colors={["#6B21A8", "#A855F7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="notifications" size={22} color="white" />
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.headerRight}>
          <Pressable style={styles.iconBtn} onPress={markAllRead}>
            <Ionicons name="checkmark-done-outline" size={20} color="white" />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={clearAll}>
            <Ionicons name="trash-outline" size={20} color="white" />
          </Pressable>
        </View>
      </LinearGradient>

      {/* List */}
      <SectionList
        sections={grouped}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#A78BFA" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Image
              source={{
                uri: "https://img.icons8.com/ios/100/A78BFA/notifications--v1.png",
              }}
              style={{ width: 80, height: 80, marginBottom: 12 }}
            />
            <Text style={styles.emptyTitle}>You're all caught up</Text>
            <Text style={styles.emptySub}>No new notifications right now.</Text>
          </View>
        }
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#111827" },

  header: {
    paddingTop: 46,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 6,
    shadowColor: "#A855F7",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "700", marginLeft: 10 },
  unreadBadge: {
    marginLeft: 8,
    backgroundColor: "#F87171",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  unreadBadgeText: { color: "white", fontWeight: "700", fontSize: 12 },
  headerRight: { flexDirection: "row", alignItems: "center" },
  iconBtn: {
    marginLeft: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 8,
    borderRadius: 10,
  },

  sectionHeader: {
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#E5E7EB",
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
  },
  cardUnread: {
    backgroundColor: "#8B5CF6",
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: { flex: 1 },
  rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 15, color: "#E5E7EB", fontWeight: "600", flex: 1 },
  titleUnread: { color: "#fff" },
  time: { fontSize: 12, color: "#9CA3AF", marginLeft: 12 },
  body: { marginTop: 6, color: "#D1D5DB", fontSize: 13 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F87171",
    marginLeft: 10,
    marginTop: 6,
  },

  empty: { alignItems: "center", marginTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#E5E7EB", marginBottom: 6 },
  emptySub: { color: "#9CA3AF" },
});
