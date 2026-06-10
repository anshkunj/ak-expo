import { View, Button } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

// MUST be outside component
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationsScreen() {
  
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    console.log("Permission:", status);
  };

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Expense Tracker 🔔",
        body: "Test notification working!",
      },
      trigger: null, // instant
    });
  };

  const sendDelayedNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder ⏰",
        body: "10 seconds ho gaye 😄",
      },
      trigger: {
        seconds: 10,
      },
    });
  };

  return (
    <View className="flex-1 justify-center items-center gap-4 bg-white">

      <Button
        title="Request Permission"
        onPress={requestPermission}
      />

      <Button
        title="Send Instant Notification"
        onPress={sendNotification}
      />

      <Button
        title="Send 10 sec Notification"
        onPress={sendDelayedNotification}
      />

    </View>
  );
}