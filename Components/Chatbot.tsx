import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Animated,
    Easing,
    ScrollView,
} from "react-native";

// --- FAQ DATA ---
// Add or edit entries here. Each entry has:
//   tags  -- keywords to match against the user's message (lowercase)
//   q     -- the canonical question (just for readability)
//   a     -- the answer Verta will reply with
const FAQ: { tags: string[]; q: string; a: string }[] = [
    {
        tags: ["verify", "check", "fact", "claim", "news", "misinformation", "fake"],
        q: "How do I verify a claim?",
        a: "Tap the search bar on the Home screen or the compose icon next to it. On the Compose screen, type your claim and optionally attach a photo, audio, or link -- then hit Verify.",
    },
    {
        tags: ["account", "profile", "login", "sign in", "signin", "register", "signup"],
        q: "How do I access my account?",
        a: "Tap the profile icon (person bust) in the top-right corner of the Home screen. The menu includes History, Saved, Archives, Rewards, About, and Logout.",
    },
    {
        tags: ["reward", "point", "score", "earn", "badge", "gamif"],
        q: "How do rewards work?",
        a: "You earn points every time you verify content or engage with the platform. Open your profile menu and tap Rewards to see your points, badges, and leaderboard rank.",
    },
    {
        tags: ["history", "past", "previous", "old", "saved", "archive"],
        q: "Where is my verification history?",
        a: "Tap the profile icon then History to see all past verifications. Tap Saved for bookmarked results, or Archives for older records.",
    },
    {
        tags: ["deepfake", "image", "audio", "video", "fake media", "detect"],
        q: "Can Veritas detect deepfakes?",
        a: "Yes! On the Compose screen, attach an image, audio clip, or video. Veritas will run AI-powered deepfake detection and show you a confidence score.",
    },
    {
        tags: ["chatbot", "verta", "ai", "bot", "help", "support"],
        q: "What can Verta help with?",
        a: "Verta is your in-app AI guide. Ask me about app features, how to navigate screens, or general fact-checking questions. For live news verdicts, use the Compose screen.",
    },
    {
        tags: ["language", "translation", "locale", "i18n", "multilingual"],
        q: "What languages does Veritas support?",
        a: "Veritas supports 6 languages. Go to Settings from your profile menu and choose your preferred language.",
    },
    {
        tags: ["password", "reset", "forgot", "otp", "email"],
        q: "I forgot my password",
        a: "On the login screen, tap Forgot password. Enter your email and you will receive a one-time password (OTP) to reset your credentials.",
    },
    {
        tags: ["spam", "call", "truecaller", "unknown", "phone"],
        q: "What is the spam call feature?",
        a: "Veritas includes a Truecaller-like spam call screen that alerts you to potentially fraudulent or spam callers in real time.",
    },
    {
        tags: ["offline", "internet", "network", "connection"],
        q: "Does Veritas work offline?",
        a: "Most features require an internet connection to fetch news and run AI analysis. Your saved and archived items are accessible offline.",
    },
    {
        tags: ["news", "feed", "home", "latest", "article"],
        q: "How does the news feed work?",
        a: "The Home screen shows a curated feed of recent news and fact-check results. Pull down to refresh for the latest articles from verified sources.",
    },
    {
        tags: ["delete", "remove", "close", "deactivate"],
        q: "How do I delete my account?",
        a: "To delete your account, go to your profile menu then About then Contact Support, and request account deletion. Our team will process it within 48 hours.",
    },
];

const FALLBACK_ANSWER =
    "Hmm, I don't have a specific answer for that yet. Try asking about verifying claims, your account, rewards, deepfake detection, or forgotten password.";

const GREETING =
    "Hi! I'm Verta, your Veritas support guide. Ask me anything about the app, or tap a topic below.";

const INITIAL_SUGGESTIONS = [
    "How to verify?",
    "My rewards",
    "Forgot password",
    "Deepfake detection",
    "Languages",
];

// --- TYPES ---
type Message = {
    id: string;
    role: "user" | "bot";
    text: string;
};

// --- FAQ MATCHING ---
function findAnswer(input: string): string {
    const lower = input.toLowerCase();
    let best: (typeof FAQ)[0] | null = null;
    let bestScore = 0;

    for (const entry of FAQ) {
        let score = 0;
        for (const tag of entry.tags) {
            if (lower.includes(tag)) score++;
        }
        if (score > bestScore) {
            bestScore = score;
            best = entry;
        }
    }

    return bestScore > 0 ? best!.a : FALLBACK_ANSWER;
}

// --- COMPONENT ---
export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { id: "0", role: "bot", text: GREETING },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);

    const listRef = useRef<FlatList<Message>>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    // Open/close animation
    useEffect(() => {
        if (open) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            fadeAnim.setValue(0);
            slideAnim.setValue(30);
        }
    }, [open]);

    // Typing dots animation
    useEffect(() => {
        if (!isTyping) return;
        const animDot = (dot: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, { toValue: -5, duration: 300, useNativeDriver: true }),
                    Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
                    Animated.delay(600),
                ])
            );
        const a1 = animDot(dot1, 0);
        const a2 = animDot(dot2, 200);
        const a3 = animDot(dot3, 400);
        a1.start();
        a2.start();
        a3.start();
        return () => {
            a1.stop();
            a2.stop();
            a3.stop();
            dot1.setValue(0);
            dot2.setValue(0);
            dot3.setValue(0);
        };
    }, [isTyping]);

    // Scroll to bottom
    useEffect(() => {
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages, isTyping]);

    const handleSend = useCallback(
        (text?: string) => {
            const trimmed = (text ?? input).trim();
            if (!trimmed || isTyping) return;

            setInput("");
            setSuggestions([]);

            const userMsg: Message = {
                id: Date.now().toString(),
                role: "user",
                text: trimmed,
            };
            setMessages((prev) => [...prev, userMsg]);
            setIsTyping(true);

            setTimeout(() => {
                const answer = findAnswer(trimmed);
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "bot",
                    text: answer,
                };
                setIsTyping(false);
                setMessages((prev) => [...prev, botMsg]);
                setSuggestions(["Another question", "Verify a claim", "Rewards", "Deepfake"]);
            }, 800);
        },
        [input, isTyping]
    );

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.role === "user";
        return (
            <View style={[styles.msg, isUser ? styles.userMsg : styles.botMsg]}>
                <Text style={isUser ? styles.userText : styles.botText}>{item.text}</Text>
            </View>
        );
    };

    return (
        <>
            {open && (
                <KeyboardAvoidingView
                    behavior={Platform.select({ ios: "padding", android: undefined })}
                    style={styles.wrapper}
                >
                    <Animated.View
                        style={[
                            styles.box,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                        ]}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Verta Support</Text>
                            <Text style={styles.headerSub}>Powered by Veritas FAQ</Text>
                        </View>

                        {/* Messages */}
                        <FlatList
                            ref={listRef}
                            data={messages}
                            keyExtractor={(m) => m.id}
                            contentContainerStyle={styles.list}
                            renderItem={renderMessage}
                            ListFooterComponent={
                                isTyping ? (
                                    <View style={styles.typingBubble}>
                                        {[dot1, dot2, dot3].map((dot, i) => (
                                            <Animated.View
                                                key={i}
                                                style={[
                                                    styles.dot,
                                                    { transform: [{ translateY: dot }] },
                                                ]}
                                            />
                                        ))}
                                    </View>
                                ) : null
                            }
                        />

                        {/* Suggestion chips */}
                        {suggestions.length > 0 && (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.suggestionsRow}
                            >
                                {suggestions.map((s) => (
                                    <Pressable
                                        key={s}
                                        style={styles.chip}
                                        onPress={() => handleSend(s)}
                                    >
                                        <Text style={styles.chipText}>{s}</Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        )}

                        {/* Input row */}
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.textInput}
                                value={input}
                                onChangeText={setInput}
                                placeholder="Ask something..."
                                placeholderTextColor="#555"
                                returnKeyType="send"
                                onSubmitEditing={() => handleSend()}
                                editable={!isTyping}
                            />
                            <Pressable
                                style={[styles.sendBtn, isTyping && styles.sendBtnDisabled]}
                                onPress={() => handleSend()}
                                disabled={isTyping}
                            >
                                <Text style={styles.sendBtnText}>Send</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            )}

            {/* FAB */}
            <Pressable style={styles.fab} onPress={() => setOpen((v) => !v)}>
                <Text style={styles.fabIcon}>{open ? "Close" : "Chat"}</Text>
            </Pressable>
        </>
    );
}

// --- STYLES ---
const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 90,
        right: 20,
        zIndex: 999,
    },
    box: {
        width: 320,
        height: 440,
        backgroundColor: "#0d0d0d",
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: "#3a0066",
        overflow: "hidden",
        shadowColor: "#a64dff",
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 10,
    },
    header: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: "#3a0066",
        alignItems: "center",
    },
    headerTitle: {
        color: "#a64dff",
        fontWeight: "500",
        fontSize: 15,
        letterSpacing: 0.5,
    },
    headerSub: {
        color: "#555",
        fontSize: 11,
        marginTop: 1,
    },
    list: {
        padding: 12,
        paddingBottom: 4,
        flexGrow: 1,
    },
    msg: {
        maxWidth: "82%",
        padding: 10,
        borderRadius: 12,
        marginVertical: 4,
    },
    userMsg: {
        alignSelf: "flex-end",
        backgroundColor: "#6b00b6",
    },
    botMsg: {
        alignSelf: "flex-start",
        backgroundColor: "#1a1a1a",
        borderWidth: 0.5,
        borderColor: "#3a0066",
    },
    userText: {
        color: "#fff",
        fontSize: 13,
        lineHeight: 19,
    },
    botText: {
        color: "#cfcfcf",
        fontSize: 13,
        lineHeight: 19,
    },
    typingBubble: {
        flexDirection: "row",
        alignSelf: "flex-start",
        backgroundColor: "#1a1a1a",
        borderWidth: 0.5,
        borderColor: "#3a0066",
        borderRadius: 12,
        padding: 10,
        paddingHorizontal: 14,
        marginVertical: 4,
        gap: 4,
        alignItems: "center",
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#a64dff",
    },
    suggestionsRow: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 6,
    },
    chip: {
        borderWidth: 0.5,
        borderColor: "#a64dff",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 6,
    },
    chipText: {
        color: "#a64dff",
        fontSize: 11,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 10,
        borderTopWidth: 0.5,
        borderTopColor: "#3a0066",
    },
    textInput: {
        flex: 1,
        backgroundColor: "#1a1a1a",
        borderWidth: 0.5,
        borderColor: "#3a0066",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: "#fff",
        fontSize: 13,
    },
    sendBtn: {
        backgroundColor: "#a64dff",
        paddingHorizontal: 14,
        height: 38,
        justifyContent: "center",
        borderRadius: 10,
    },
    sendBtnDisabled: {
        backgroundColor: "#6b00b6",
        opacity: 0.5,
    },
    sendBtnText: {
        color: "#fff",
        fontWeight: "500",
        fontSize: 13,
    },
    fab: {
        position: "absolute",
        bottom: 24,
        right: 20,
        backgroundColor: "#a64dff",
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#a64dff",
        shadowOpacity: 0.7,
        shadowRadius: 12,
        elevation: 8,
        zIndex: 1000,
    },
    fabIcon: {
        fontSize: 13,
        fontWeight: "500",
        color: "#fff",
    },
});