import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

type LanguageKey =
  | "English"
  | "French"
  | "German"
  | "Spanish"
  | "Chinese"
  | "Hindi";

const languageMapping: Record<LanguageKey, string> = {
  English: "en",
  French: "fr",
  German: "de",
  Spanish: "es",
  Chinese: "zh",
  Hindi: "hi",
};

export default function Language() {
  const { i18n } = useTranslation();
  const [selected, setSelected] = useState<string>(i18n.language);

  const languages: LanguageKey[] = [
    "English",
    "French",
    "German",
    "Spanish",
    "Chinese",
    "Hindi",
  ];

  const handleLanguageSelect = (lang: LanguageKey) => {
    const langCode = languageMapping[lang];
    i18n.changeLanguage(langCode);
    setSelected(langCode);
    router.push("/onboarding/signin");
  };

  return (
    <ImageBackground
      source={require("../../assets/back_gnd.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>
          What language would you like to choose?
        </Text>

        {languages.map((lang, i) => (
          <Pressable
            key={i}
            style={styles.optionWrapper}
            onPress={() => handleLanguageSelect(lang)}
          >
            <View
              style={[
                styles.glassContainer,
                selected === languageMapping[lang] && styles.optionSelected,
              ]}
            >
              {/* 🌸 LIGHT PURPLE TRANSPARENT */}
              <View style={styles.transparentLayer} />

              {/* Content */}
              <View style={styles.content}>
                <View
                  style={[
                    styles.circle,
                    selected === languageMapping[lang] &&
                      styles.circleSelected,
                  ]}
                />
                <Text style={styles.btnText}>{lang}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(10,10,25,0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "#c084fc", // 🌸 lighter purple
  },

  optionWrapper: {
    width: "80%",
    marginVertical: 8,
    borderRadius: 16,
    overflow: "hidden",
  },

  glassContainer: {
    padding: 14,
    borderRadius: 16,
    position: "relative",

    // 🔥 soft glass feel (no blur)
    backgroundColor: "rgba(168,85,247,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  transparentLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(168,85,247,0.10)", // 🌸 super light purple
    borderRadius: 16,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionSelected: {
    borderColor: "#c084fc",
    shadowColor: "#a855f7",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },

  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    marginRight: 12,
  },

  circleSelected: {
    backgroundColor: "#c084fc",
  },

  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});