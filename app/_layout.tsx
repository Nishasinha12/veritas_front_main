import { Stack } from "expo-router";
import { Image, View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import './i18n'; // keep if you're using translations (otherwise remove)
export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0a0a19",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require("../assets/logo2.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="compose" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 100,
    height: 100,
    marginRight: 8,
  },

  title: {
    color: "#a855f7",
    fontSize: 18,
    fontWeight: "700",
  },
});