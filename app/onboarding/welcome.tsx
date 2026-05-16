import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
} from "react-native";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

const { height } = Dimensions.get("window");

export default function Welcome() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    // pulse glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // button shine
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const cards = [
    {
      img: require("../../assets/detect1.jpeg"),
      title: "AI Detection",
      desc: "Detect fake images and audio instantly",
    },
    {
      img: require("../../assets/truth1.jpeg"),
      title: "Truth Score",
      desc: "Get credibility rating with intelligent analysis",
    },
    {
      img: require("../../assets/evidence1.jpeg"),
      title: "Evidence-Based",
      desc: "Backed with verified data and trusted sources",
    },
    {
      img: require("../../assets/secure2.jpeg"),
      title: "Secure Analysis",
      desc: "Your data is protected and processed safely",
    },
  ];

  return (
    <ImageBackground
      source={require("../../assets/final_land1.jpg")}
      style={styles.background}
    >
      <LinearGradient
        colors={["rgba(19,17,57,0.25)", "rgba(19,17,57,0.75)"]}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Title */}
        <MaskedView
          maskElement={
            <Text style={styles.caption}>
              Unmask the truth{"\n"}in every pixel
            </Text>
          }
        >
          <LinearGradient colors={["#ff4ecd", "#ff8ac6", "#ffb3d9"]}>
            <Text style={[styles.caption, { opacity: 0 }]}>
              Unmask the truth{"\n"}in every pixel
            </Text>
          </LinearGradient>
        </MaskedView>

        <View style={{ height: 20 }} />

        {/* Cards */}
        {cards.map((card, index) => {
          const inputRange = [
            (index - 1) * 260,
            index * 260,
            (index + 1) * 260,
          ];

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.9, 1.08, 0.9],
            extrapolate: "clamp",
          });

          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            >
              <BlurView
                intensity={25}   // 🔻 reduced blur (clearer glass)
                tint="dark"
                style={styles.card}
              >
                <ImageBackground
                  source={card.img}
                  style={styles.cardImage}
                  imageStyle={styles.cardImageStyle}
                >
                  <View style={styles.cardOverlay}>
                    <MaskedView
                      maskElement={
                        <Text style={styles.cardTitle}>{card.title}</Text>
                      }
                    >
                      <LinearGradient colors={["#ff4ecd", "#ff8ac6"]}>
                        <Text style={[styles.cardTitle, { opacity: 0 }]}>
                          {card.title}
                        </Text>
                      </LinearGradient>
                    </MaskedView>

                    <Text style={styles.cardDesc}>{card.desc}</Text>
                  </View>
                </ImageBackground>
              </BlurView>
            </Animated.View>
          );
        })}

        <View style={{ height: 80 }} />

        {/* Button with Shine */}
        <View style={styles.btnWrapper}>
          <Animated.View
            style={[
              styles.btnGlow,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />

          <Pressable
            style={styles.btn}
            onPress={() => router.push("/onboarding/language")}
          >
            {/* Shine overlay */}
            <Animated.View
              style={[
                styles.shine,
                {
                  transform: [
                    {
                      translateX: shineAnim.interpolate({
                        inputRange: [-1, 1],
                        outputRange: [-200, 200],
                      }),
                    },
                  ],
                },
              ]}
            />

            <Text style={styles.btnText}>Get Started</Text>
          </Pressable>
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },

  scrollContainer: {
    paddingTop: 100,
    paddingBottom: 120,
    alignItems: "center",
  },

  caption: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 40,
  },

  card: {
    width: "90%",
    height: 220,
    marginVertical: 14,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)", // 🔥 more contrast
  },

  cardImage: { flex: 1, justifyContent: "flex-end" },

  cardImageStyle: {
    borderRadius: 20,
    opacity: 0.9, // slightly stronger image visibility
  },

  cardOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    padding: 15,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  cardDesc: {
    color: "#ffc1e3",
    fontSize: 13,
    marginTop: 4,
  },

  btnWrapper: {
    width: "85%",
    alignItems: "center",
    position: "relative",
  },

  btnGlow: {
    position: "absolute",
    width: "100%",
    height: 55,
    borderRadius: 14,
    backgroundColor: "#8C7DFC",
    opacity: 0.5,
  },

  btn: {
    backgroundColor: "rgb(144, 20, 201)",
    paddingVertical: 14,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    overflow: "hidden",
  },

  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  shine: {
    position: "absolute",
    width: 80,
    height: "200%",
    
    transform: [{ rotate: "25deg" }],
  },
 
});