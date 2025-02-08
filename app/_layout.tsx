import { Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  useEffect(() => {
    // Allow all orientations
    async function enableRotation() {
      await ScreenOrientation.unlockAsync();
    }
    enableRotation();

    // Clean up by locking to portrait when component unmounts
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Dooodle",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="board/[id]"
            options={{
              title: "Drawing Board",
              headerBackTitle: "Back",
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
