import { View, Text, Button, Image, Alert } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

export default function Home() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  // 📸 IMAGE PICKER
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission denied for gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 📍 LOCATION
  const getLocation = async () => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();
  
    if (status !== "granted") {
      Alert.alert("Location permission denied");
      return;
    }
  
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
  
      console.log("LOCATION:", loc);
  
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy,
      });
    } catch (error) {
      console.log("Location error:", error);
      Alert.alert("Failed to fetch location");
    }
  };

  // 🔔 NOTIFICATIONS
  const sendNotification = async () => {
    const { status } =
      await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Notification permission denied");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification 🔔",
        body: "Everything is working fine!",
      },
      trigger: null,
    });
  };

  return (
    <View className="flex-1 bg-black justify-center items-center gap-6 p-4">

      <Text className="text-white text-xl font-bold">
        Expo Feature Test Panel
      </Text>

      {/* IMAGE */}
      <Button title="Pick Image" onPress={pickImage} />

      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 150, height: 150, borderRadius: 10 }}
        />
      )}

      {/* LOCATION */}
      <Button title="Get Location" onPress={getLocation} />

      {location && (
        <View className="bg-white p-3 rounded-lg">
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
          <Text>Accuracy: {location.accuracy}</Text>
        </View>
      )}

      {location && (
        <Text className="text-white text-center">
          Lat: {location.latitude}
          {"\n"}
          Lng: {location.longitude}
        </Text>
      )}

      {/* NOTIFICATION */}
      <Button
        title="Send Notification"
        onPress={sendNotification}
      />
    </View>
  );
}