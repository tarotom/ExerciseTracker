import { Stack } from 'expo-router';
import FlashMessage from "react-native-flash-message";

const RootLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      {/* @ts-ignore */}
      <FlashMessage position="top" />
    </>
  );
}

export default RootLayout;