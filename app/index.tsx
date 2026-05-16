import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function IndexGate() {
  const router = useRouter();

  useEffect(() => {
    // Delay navigation until after RootLayout is mounted
    const timer = setTimeout(() => {
      const done = false; // fake flag for now

      if (done) {
        router.replace("/home");
      } else {
        router.replace("/onboarding/welcome");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
    </View>
  );
}