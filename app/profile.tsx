import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";
import {router} from 'expo-router';

type Profile = {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

export default function ProfileScreen() {
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setEmail(user.email ?? "");

      const { data, error } = await supabase
        .from("profiles")
        .select("username, display_name, avatar_url, bio")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function confirmLogout() {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: handleLogout,
        },
      ]
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/(auth)/login");
  }

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="items-center px-6 pt-16">
        <Pressable onPress={pickImage} className="w-32 h-32 rounded-full border-2 border-zinc-700">
          <Image
            source={{
              uri:
                profile?.avatar_url ||
                "https://placehold.co/200x200/png",
            }}
            className="w-32 h-32 rounded-full border-2 border-zinc-700"
          />
        </Pressable>

        <Text className="text-white text-2xl font-bold mt-5">
          {profile?.display_name || "No Name"}
        </Text>

        <Text className="text-zinc-400 text-base mt-1">
          @{profile?.username || "username"}
        </Text>

        <Text className="text-zinc-500 mt-2">
          {email}
        </Text>

        <View className="w-full bg-zinc-900 rounded-3xl p-5 mt-8">
          <Text className="text-zinc-400 text-sm mb-2">
            Bio
          </Text>

          <Text className="text-white text-base">
            {profile?.bio || "No bio added yet."}
          </Text>
        </View>

        <TouchableOpacity
          onPress={confirmLogout}
          className="bg-red-600 w-full py-4 rounded-2xl mt-8 mb-10"
        >
          <Text className="text-white text-center font-semibold text-base">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}