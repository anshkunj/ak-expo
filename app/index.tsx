<<<<<<< HEAD
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useFocusEffect } from '@react-navigation/native';

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [expense, setExpense] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState("");

  const fetchUserProfile = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
  
      if (error || !user) {
        router.replace("/(auth)/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();
  
      if (profileError) {
        console.log(profileError);
      }

      if (!profile?.username) {
        router.replace("/choose-username");
        return;
      }

      setAvatar(profile?.avatar_url || "");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    },[])
  );

  useEffect(() => {
    fetchData();
  },[])
  
  async function fetchData() {
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.log(error);
        return;
      }
      setRefreshing(false);
      setExpenses(data || []);
    } catch (error) {
      console.log(error);
=======
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
>>>>>>> 9807c46
    }

<<<<<<< HEAD
  function goToProfile() {
    router.push("/profile");
  }
=======
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
>>>>>>> 9807c46

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

<<<<<<< HEAD
  const Header = () => (
    <View className="mb-8">
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-3xl font-bold">
          Expense Tracker
        </Text>

        <Pressable
          onPress={goToProfile}
          className="bg-white rounded-full active:opacity-70"
        >
          <Image
            source={{ uri: avatar || "https://placehold.co/200x200/png" }}
            className="w-14 h-14 rounded-full border-2 border-zinc-700"
          />
        </Pressable>
      </View>

      <Text className="text-zinc-400 mt-2">
        Track every rupee you spend
      </Text>
    </View>
  );

  const EmptyState = () => (
    <View className="items-center py-20">
      <Text className="text-6xl">💸</Text>

      <Text className="text-zinc-400 mt-4 text-lg">
        No expenses yet
      </Text>

      <Text className="text-zinc-600 mt-1">
        Add your first expense below
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#22c55e" />

        <Text className="text-zinc-400 mt-4">
          Loading expenses...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          data={expenses}
          refreshing={refreshing}
          onRefresh={fetchData}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 140,
          }}
          columnWrapperStyle={
            expenses.length > 1
              ? { justifyContent: "space-between" }
              : undefined
          }
          ListHeaderComponent={<Header />}
          ListEmptyComponent={<EmptyState />}
          renderItem={({ item }) => (
            <Pressable
              className="
                bg-zinc-900
                rounded-3xl
                p-5
                mb-4
                w-[48%]
                border
                border-zinc-800
              "
            >
              <View className="flex-row justify-between items-start">
                <Text
                  className="
                    text-green-500
                    font-bold
                    text-xs
                  "
                >
                  #{item.id}
                </Text>
=======
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
>>>>>>> 9807c46

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
<<<<<<< HEAD
      </KeyboardAvoidingView>
=======
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
>>>>>>> 9807c46
    </View>
  );
}