import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}