import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView, AnimatePresence } from "moti";

interface CallEvent {
  id: string;
  phoneNumber: string;
  callerName: string;
  timestamp: string;
  type: "incoming" | "outgoing" | "missed";
  isSpam: boolean;
}

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  isEmergency: boolean;
}

interface Message {
  id: string;
  senderName: string;
  senderNumber: string;
  message: string;
  timestamp: string;
  isBusinessChat: boolean;
  unreadCount: number;
}

export default function TruecallerScreen() {
  const [activeTab, setActiveTab] = useState<"contacts" | "calls" | "messages" | "dialer">("calls");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialNumber, setDialNumber] = useState("");
  const [callEvents, setCallEvents] = useState<CallEvent[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Load call events
  useEffect(() => {
    const dummyEvents: CallEvent[] = [
      {
        id: "1",
        phoneNumber: "+91 98765 43210",
        callerName: "John Doe",
        timestamp: "2 mins ago",
        type: "incoming",
        isSpam: false,
      },
      {
        id: "2",
        phoneNumber: "+91 87654 32109",
        callerName: "Spam Likely",
        timestamp: "15 mins ago",
        type: "missed",
        isSpam: true,
      },
      {
        id: "3",
        phoneNumber: "+91 76543 21098",
        callerName: "Sarah Smith",
        timestamp: "1 hour ago",
        type: "outgoing",
        isSpam: false,
      },
      {
        id: "4",
        phoneNumber: "+91 65432 10987",
        callerName: "Marketing Call",
        timestamp: "3 hours ago",
        type: "incoming",
        isSpam: true,
      },
    ];
    setCallEvents(dummyEvents);
  }, []);

  // Load messages
  useEffect(() => {
    const dummyMessages: Message[] = [
      {
        id: "m1",
        senderName: "CANARA",
        senderNumber: "CANARA",
        message: "An amount of INR 500.00 has been CREDI...",
        timestamp: "Thu",
        isBusinessChat: true,
        unreadCount: 15,
      },
      {
        id: "m2",
        senderName: "Canara Bank",
        senderNumber: "XX3963",
        message: "Your a/c no. XX3963 has been credited wit...",
        timestamp: "Thu",
        isBusinessChat: true,
        unreadCount: 1,
      },
      {
        id: "m3",
        senderName: "Team Truecaller",
        senderNumber: "Truecaller",
        message: "Truecaller protects iPhone too! Help you...",
        timestamp: "11 Oct",
        isBusinessChat: true,
        unreadCount: 2,
      },
      {
        id: "m4",
        senderName: "Mom❤️😘",
        senderNumber: "+91 98765 43210",
        message: "Can you 👍 call me back?",
        timestamp: "24 Sept",
        isBusinessChat: false,
        unreadCount: 1,
      },
      {
        id: "m5",
        senderName: "Canara Bank",
        senderNumber: "CANARA",
        message: "An amount of INR 196.00 has been DEBITE...",
        timestamp: "14 Sept",
        isBusinessChat: true,
        unreadCount: 3,
      },
    ];
    setMessages(dummyMessages);
  }, []);

  // Load contacts (emergency + user contacts)
  useEffect(() => {
    const dummyContacts: Contact[] = [
      // Emergency Contacts
      { id: "e1", name: "Police", phoneNumber: "100", isEmergency: true },
      { id: "e2", name: "Ambulance", phoneNumber: "102", isEmergency: true },
      { id: "e3", name: "Fire Brigade", phoneNumber: "101", isEmergency: true },
      { id: "e4", name: "Women Helpline", phoneNumber: "1091", isEmergency: true },
      { id: "e5", name: "Child Helpline", phoneNumber: "1098", isEmergency: true },
      // User Contacts
      { id: "c1", name: "John Doe", phoneNumber: "+91 98765 43210", isEmergency: false },
      { id: "c2", name: "Sarah Smith", phoneNumber: "+91 76543 21098", isEmergency: false },
      { id: "c3", name: "Mike Johnson", phoneNumber: "+91 87654 32100", isEmergency: false },
      { id: "c4", name: "Emily Davis", phoneNumber: "+91 98765 12345", isEmergency: false },
      { id: "c5", name: "Alex Brown", phoneNumber: "+91 87654 98765", isEmergency: false },
    ];
    setContacts(dummyContacts);
  }, []);

  const requestPermission = () => {
    setTimeout(() => {
      setPermissionGranted(true);
    }, 800);
  };

  const makeCall = (number: string) => {
    const phoneNumber = number.replace(/\s/g, "");
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleDialPadPress = (digit: string) => {
    setDialNumber((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setDialNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (dialNumber) {
      makeCall(dialNumber);
    } else {
      Alert.alert("Error", "Please enter a phone number");
    }
  };

  const getCallIcon = (type: string) => {
    switch (type) {
      case "incoming":
        return "call-outline";
      case "outgoing":
        return "call-outline";
      case "missed":
        return "close-circle-outline";
      default:
        return "call-outline";
    }
  };

  const getCallColor = (type: string, isSpam: boolean) => {
    if (isSpam) return "#FF4444";
    switch (type) {
      case "incoming":
        return "#32CD32";
      case "outgoing":
        return "#4169E1";
      case "missed":
        return "#FF6B6B";
      default:
        return "#B197FC";
    }
  };

  // Filter contacts based on search
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phoneNumber.includes(searchQuery)
  );

  // Filter messages based on search
  const filteredMessages = messages.filter(
    (message) =>
      message.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render Contacts Tab
  const renderContactsTab = () => (
    <View style={styles.tabContent}>
      {/* Emergency Contacts Section */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
      >
        <Text style={styles.sectionTitle}>🚨 Emergency Contacts</Text>
        {filteredContacts
          .filter((c) => c.isEmergency)
          .map((contact, index) => (
            <MotiView
              key={contact.id}
              from={{ opacity: 0, translateX: -30 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: "timing", duration: 300, delay: index * 80 }}
            >
              <Pressable
                style={styles.contactCard}
                onPress={() => makeCall(contact.phoneNumber)}
              >
                <LinearGradient
                  colors={["#FF4444", "#CC0000"]}
                  style={styles.contactIcon}
                >
                  <Ionicons name="warning" size={24} color="white" />
                </LinearGradient>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.phoneNumber}</Text>
                </View>
                <Ionicons name="call" size={22} color="#FF4444" />
              </Pressable>
            </MotiView>
          ))}
      </MotiView>

      {/* User Contacts Section */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400, delay: 200 }}
      >
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          👤 Your Contacts
        </Text>
        {filteredContacts
          .filter((c) => !c.isEmergency)
          .map((contact, index) => (
            <MotiView
              key={contact.id}
              from={{ opacity: 0, translateX: -30 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: "timing", duration: 300, delay: index * 80 }}
            >
              <Pressable
                style={styles.contactCard}
                onPress={() => makeCall(contact.phoneNumber)}
              >
                <LinearGradient
                  colors={["#9333EA", "#7C3AED"]}
                  style={styles.contactIcon}
                >
                  <Text style={styles.contactInitial}>
                    {contact.name.charAt(0)}
                  </Text>
                </LinearGradient>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.phoneNumber}</Text>
                </View>
                <Ionicons name="call-outline" size={22} color="#9333EA" />
              </Pressable>
            </MotiView>
          ))}
      </MotiView>
    </View>
  );

  // Render Messages Tab
  const renderMessagesTab = () => (
    <View style={styles.tabContent}>
      {/* SMS Permission Banner */}
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", delay: 100 }}
      >
        <View style={styles.smsPermissionBanner}>
          <View style={styles.smsIconContainer}>
            <Ionicons name="mail-outline" size={32} color="#9333EA" />
          </View>
          <View style={styles.smsTextContainer}>
            <Text style={styles.smsPermissionTitle}>Give permission to view SMS</Text>
            <Text style={styles.smsPermissionSubtitle}>
              Only Chat messages can be shown in your Inbox at the moment
            </Text>
          </View>
        </View>
        <Pressable style={styles.viewSmsButton}>
          <Text style={styles.viewSmsButtonText}>View SMS</Text>
        </Pressable>
      </MotiView>

      {/* Messages List */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent Messages</Text>
      <FlatList
        data={filteredMessages}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", duration: 400, delay: index * 80 }}
          >
            <Pressable style={styles.messageCard}>
              <View style={styles.messageIconContainer}>
                <LinearGradient
                  colors={item.isBusinessChat ? ["#10B981", "#059669"] : ["#9333EA", "#7C3AED"]}
                  style={styles.messageIcon}
                >
                  <Text style={styles.messageInitial}>
                    {item.senderName.charAt(0)}
                  </Text>
                </LinearGradient>
                {item.isBusinessChat && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#4169E1" />
                  </View>
                )}
              </View>

              <View style={styles.messageInfo}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageSenderName}>{item.senderName}</Text>
                  {item.isBusinessChat && (
                    <View style={styles.businessChatBadge}>
                      <Text style={styles.businessChatText}>Business Chat</Text>
                    </View>
                  )}
                  <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
                </View>
                <Text style={styles.messageText} numberOfLines={1}>
                  {item.message}
                </Text>
              </View>

              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                </View>
              )}
            </Pressable>
          </MotiView>
        )}
      />
    </View>
  );

  // Render Calls Tab
  const renderCallsTab = () => (
    <View style={styles.tabContent}>
      {/* Status Card */}
      {!permissionGranted ? (
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", delay: 100 }}
        >
          <LinearGradient
            colors={["#2d1b4e", "#4a2f73"]}
            style={styles.statusCard}
          >
            <MotiView
              from={{ rotate: "0deg" }}
              animate={{ rotate: "360deg" }}
              transition={{ type: "timing", duration: 2000, loop: true }}
            >
              <Ionicons name="sync-circle-outline" size={48} color="#B197FC" />
            </MotiView>
            <Text style={styles.statusTitle}>Ready to receive call events</Text>
            <Text style={styles.statusSubtitle}>
              Grant permissions to identify spam calls
            </Text>
            <Pressable style={styles.permissionButton} onPress={requestPermission}>
              <LinearGradient
                colors={["#9333EA", "#7C3AED"]}
                style={styles.permissionButtonGradient}
              >
                <Text style={styles.permissionButtonText}>Grant Permission</Text>
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </MotiView>
      ) : (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", delay: 100 }}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={styles.statusCard}
          >
            <Ionicons name="checkmark-circle" size={48} color="white" />
            <Text style={[styles.statusTitle, { color: "white" }]}>
              Protection Active
            </Text>
          </LinearGradient>
        </MotiView>
      )}

      {/* Stats Cards */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400, delay: 200 }}
      >
        <View style={styles.statsContainer}>
          <LinearGradient colors={["#2d1b4e", "#4a2f73"]} style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Spam Blocked</Text>
            <Ionicons name="shield-outline" size={24} color="#FF4444" />
          </LinearGradient>
          <LinearGradient colors={["#2d1b4e", "#4a2f73"]} style={styles.statCard}>
            <Text style={styles.statNumber}>47</Text>
            <Text style={styles.statLabel}>Calls Today</Text>
            <Ionicons name="call-outline" size={24} color="#32CD32" />
          </LinearGradient>
        </View>
      </MotiView>

      {/* Recent Calls */}
      <Text style={styles.sectionTitle}>Recent Call Events</Text>
      <FlatList
        data={callEvents}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateX: -50, scale: 0.9 }}
            animate={{ opacity: 1, translateX: 0, scale: 1 }}
            transition={{ type: "timing", duration: 400, delay: index * 100 }}
          >
            <Pressable style={styles.callCard}>
              <View style={styles.callIconContainer}>
                <LinearGradient
                  colors={[
                    getCallColor(item.type, item.isSpam),
                    `${getCallColor(item.type, item.isSpam)}99`,
                  ]}
                  style={styles.callIcon}
                >
                  <Ionicons
                    name={getCallIcon(item.type) as any}
                    size={22}
                    color="white"
                  />
                </LinearGradient>
              </View>

              <View style={styles.callInfo}>
                <View style={styles.callHeader}>
                  <Text style={styles.callerName}>{item.callerName}</Text>
                  {item.isSpam && (
                    <View style={styles.spamBadge}>
                      <Ionicons name="warning" size={12} color="white" />
                      <Text style={styles.spamText}>SPAM</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#9B59B6" />
            </Pressable>
          </MotiView>
        )}
      />

      {!permissionGranted && (
        <View style={styles.deniedContainer}>
          <Ionicons name="information-circle-outline" size={24} color="#9B59B6" />
          <Text style={styles.deniedText}>Contacts permission denied.</Text>
        </View>
      )}
    </View>
  );

  // Render Dialer Tab - PURPLE THEME
  const renderDialerTab = () => {
    const dialPadButtons = [
      { digit: "1", letters: "" },
      { digit: "2", letters: "ABC" },
      { digit: "3", letters: "DEF" },
      { digit: "4", letters: "GHI" },
      { digit: "5", letters: "JKL" },
      { digit: "6", letters: "MNO" },
      { digit: "7", letters: "PQRS" },
      { digit: "8", letters: "TUV" },
      { digit: "9", letters: "WXYZ" },
      { digit: "*", letters: "" },
      { digit: "0", letters: "+" },
      { digit: "#", letters: "" },
    ];

    return (
      <View style={styles.tabContent}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", delay: 100 }}
        >
          {/* Display Screen */}
          <View style={styles.dialDisplay}>
            <Text style={styles.dialNumber}>{dialNumber || "Enter number"}</Text>
            {dialNumber.length > 0 && (
              <Pressable onPress={handleBackspace} style={styles.backspaceButton}>
                <Ionicons name="backspace-outline" size={28} color="#9333EA" />
              </Pressable>
            )}
          </View>

          {/* Dial Pad */}
          <View style={styles.dialPad}>
            {dialPadButtons.map((button, index) => (
              <MotiView
                key={button.digit}
                from={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  delay: 200 + index * 50,
                  damping: 15,
                }}
              >
                <Pressable
                  style={styles.dialButton}
                  onPress={() => handleDialPadPress(button.digit)}
                >
                  <LinearGradient
                    colors={["#2d1b4e", "#4a2f73"]}
                    style={styles.dialButtonGradient}
                  >
                    <Text style={styles.dialDigit}>{button.digit}</Text>
                    {button.letters && (
                      <Text style={styles.dialLetters}>{button.letters}</Text>
                    )}
                  </LinearGradient>
                </Pressable>
              </MotiView>
            ))}
          </View>

          {/* Call Button */}
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 800 }}
          >
            <Pressable style={styles.callButtonContainer} onPress={handleCall}>
              <LinearGradient
                colors={["#10B981", "#059669"]}
                style={styles.callButton}
              >
                <Ionicons name="call" size={32} color="white" />
              </LinearGradient>
            </Pressable>
          </MotiView>
        </MotiView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <LinearGradient
        colors={["#1a0033", "#2d1b4e", "#1a0033"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating orbs */}
      <MotiView
        from={{ translateY: 0, scale: 1 }}
        animate={{ translateY: -20, scale: 1.1 }}
        transition={{
          type: "timing",
          duration: 3000,
          loop: true,
          repeatReverse: true,
        }}
        style={[styles.floatingOrb, { top: 100, left: 30 }]}
      />
      <MotiView
        from={{ translateY: 0, scale: 1 }}
        animate={{ translateY: 20, scale: 0.9 }}
        transition={{
          type: "timing",
          duration: 4000,
          loop: true,
          repeatReverse: true,
        }}
        style={[styles.floatingOrb, { top: 300, right: 40 }]}
      />

      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", delay: 100 }}
      >
        <LinearGradient colors={["#6B46C1", "#9333EA"]} style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#EAEAEA" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Ionicons name="shield-checkmark" size={24} color="#EAEAEA" />
            <Text style={styles.headerTitle}>Mini Truecaller</Text>
          </View>
          <View style={{ width: 40 }} />
        </LinearGradient>
      </MotiView>

      {/* Search Bar - Show for Contacts, Calls, and Messages tabs */}
      {activeTab !== "dialer" && (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400 }}
          style={{ paddingHorizontal: 16, paddingTop: 16 }}
        >
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#B197FC" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search phone number or name..."
              placeholderTextColor="#8B7BA8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </MotiView>
      )}

      {/* Content Area */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === "contacts" && renderContactsTab()}
        {activeTab === "calls" && renderCallsTab()}
        {activeTab === "messages" && renderMessagesTab()}
        {activeTab === "dialer" && renderDialerTab()}
      </ScrollView>

      {/* Bottom Tab Bar - 4 Tabs: Contacts, Calls, Messages, Dialer */}
      <LinearGradient colors={["#2d1b4e", "#1a0033"]} style={styles.bottomBar}>
        <Pressable
          style={styles.tabItem}
          onPress={() => setActiveTab("contacts")}
        >
          <Ionicons
            name={activeTab === "contacts" ? "people" : "people-outline"}
            size={24}
            color={activeTab === "contacts" ? "#9333EA" : "#9B59B6"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "contacts" && styles.tabLabelActive,
            ]}
          >
            Contacts
          </Text>
        </Pressable>

        <Pressable style={styles.tabItem} onPress={() => setActiveTab("calls")}>
          <Ionicons
            name={activeTab === "calls" ? "call" : "call-outline"}
            size={24}
            color={activeTab === "calls" ? "#9333EA" : "#9B59B6"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "calls" && styles.tabLabelActive,
            ]}
          >
            Calls
          </Text>
        </Pressable>

        <Pressable style={styles.tabItem} onPress={() => setActiveTab("messages")}>
          <Ionicons
            name={activeTab === "messages" ? "chatbubbles" : "chatbubbles-outline"}
            size={24}
            color={activeTab === "messages" ? "#9333EA" : "#9B59B6"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "messages" && styles.tabLabelActive,
            ]}
          >
            Messages
          </Text>
        </Pressable>

        <Pressable style={styles.tabItem} onPress={() => setActiveTab("dialer")}>
          <Ionicons
            name={activeTab === "dialer" ? "keypad" : "keypad-outline"}
            size={24}
            color={activeTab === "dialer" ? "#9333EA" : "#9B59B6"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "dialer" && styles.tabLabelActive,
            ]}
          >
            Dialer
          </Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0033",
  },
  floatingOrb: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(147, 51, 234, 0.15)",
    opacity: 0.6,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#EAEAEA",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d1b4e",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#EAEAEA",
    fontSize: 15,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  tabContent: {
    padding: 16,
  },
  smsPermissionBanner: {
    flexDirection: "row",
    backgroundColor: "#FFF9E6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  smsIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  smsTextContainer: {
    flex: 1,
  },
  smsPermissionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  smsPermissionSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  viewSmsButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  viewSmsButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d1b4e",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  messageIconContainer: {
    marginRight: 12,
    position: "relative",
  },
  messageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  messageInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "white",
    borderRadius: 10,
  },
  messageInfo: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  messageSenderName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EAEAEA",
    marginRight: 8,
  },
  businessChatBadge: {
    backgroundColor: "#4169E1",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  businessChatText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  messageTimestamp: {
    fontSize: 12,
    color: "#B8B8B8",
    marginLeft: "auto",
  },
  messageText: {
    fontSize: 14,
    color: "#B197FC",
  },
  unreadBadge: {
    backgroundColor: "#4169E1",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: "700",
    color: "white",
  },
  statusCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#EAEAEA",
    marginTop: 12,
  },
  statusSubtitle: {
    fontSize: 14,
    color: "#B8B8B8",
    marginTop: 4,
    textAlign: "center",
  },
  permissionButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  permissionButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  permissionButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#EAEAEA",
  },
  statLabel: {
    fontSize: 12,
    color: "#B8B8B8",
    marginTop: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#EAEAEA",
    marginBottom: 16,
  },
  callCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d1b4e",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  callIconContainer: {
    marginRight: 12,
  },
  callIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  callInfo: {
    flex: 1,
  },
  callHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  callerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EAEAEA",
  },
  spamBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF4444",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  spamText: {
    fontSize: 10,
    fontWeight: "700",
    color: "white",
  },
  phoneNumber: {
    fontSize: 14,
    color: "#B197FC",
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: "#8B7BA8",
    marginTop: 2,
  },
  deniedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(155, 89, 182, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(155, 89, 182, 0.3)",
  },
  deniedText: {
    fontSize: 14,
    color: "#B8B8B8",
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d1b4e",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  contactInitial: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EAEAEA",
  },
  contactNumber: {
    fontSize: 14,
    color: "#B197FC",
    marginTop: 2,
  },
  dialDisplay: {
    backgroundColor: "#2d1b4e",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
    minHeight: 80,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  dialNumber: {
    fontSize: 32,
    fontWeight: "600",
    color: "#EAEAEA",
    flex: 1,
    textAlign: "center",
  },
  backspaceButton: {
    padding: 8,
  },
  dialPad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dialButton: {
    width: "31%",
    aspectRatio: 1,
    marginBottom: 12,
    borderRadius: 50,
    overflow: "hidden",
  },
  dialButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
    borderRadius: 50,
  },
  dialDigit: {
    fontSize: 28,
    fontWeight: "600",
    color: "#EAEAEA",
  },
  dialLetters: {
    fontSize: 10,
    color: "#B197FC",
    marginTop: 2,
  },
  callButtonContainer: {
    alignItems: "center",
  },
  callButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(147, 51, 234, 0.3)",
  },
  tabItem: {
    alignItems: "center",
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: "#9B59B6",
  },
  tabLabelActive: {
    color: "#9333EA",
    fontWeight: "600",
  },
});
