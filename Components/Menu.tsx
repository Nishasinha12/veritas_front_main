import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type MenuProps = {
  onClose: () => void;
  setShowLogout: (value: boolean) => void;
};

export default function Menu({ onClose, setShowLogout }: MenuProps) {
  const menuItems = [
    { id: "1", icon: "person-outline", label: "User", route: "/user" },
    { id: "2", icon: "time-outline", label: "History", route: "/history" },
    { id: "3", icon: "bookmark-outline", label: "Saved", route: "/saved" },
    { id: "4", icon: "folder-outline", label: "Archives", route: "/archives" },
    { id: "5", icon: "trophy-outline", label: "Rewards", route: "/rewards" },
    { id: "6", icon: "information-circle-outline", label: "About", route: "/about" },
  ];

  const handlePress = (item: typeof menuItems[0]) => {
    onClose();
    if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <View style={styles.drawer}>
      {/* Loop Menu Items */}
      {menuItems.map((item) => (
        <Pressable
          key={item.id}
          style={styles.menuItem}
          onPress={() => handlePress(item)}
        >
          <Ionicons name={item.icon as any} size={22} color="#111" />
          <Text style={styles.menuText}>{item.label}</Text>
        </Pressable>
      ))}

      {/* Logout Trigger */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          onClose();
          setShowLogout(true);
        }}
      >
        <Ionicons name="log-out-outline" size={22} color="#111" />
        <Text style={styles.menuText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    width: 250,
    backgroundColor: "white",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#111",
    fontWeight: "500",
  },
});
