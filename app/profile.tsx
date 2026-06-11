import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Pressable,
  TextInput,
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
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);
  
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [saving, setSaving] = useState(false);
  

  async function saveBio() {
    try {
      setSaving(true);
  
      const { error } = await supabase
        .from("profiles")
        .update({ bio })
        .eq("id", id);
  
      if (error) throw error;
  
      setProfile((prev) =>
        prev ? { ...prev, bio } : prev
      );
  
      setEditingBio(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to save bio.");
    } finally {
      setSaving(false);
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
  
    if (result.canceled || !id) return;
  
    try {
      const img = result.assets[0].uri;
      const filePath = `${id}/avatar.jpg`;
      
      const formData = new FormData();
      
      formData.append("file", {
        uri: img,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as any);
      
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, formData, {
          upsert: true,
          contentType: "image/jpeg",
        });
      
      if (uploadError) {
        console.log(uploadError);
        throw uploadError;
      }
  
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
  
      const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;
  
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          avatar_url: avatarUrl,
        })
        .eq("id", id);
  
      if (profileError) throw profileError;
  
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              avatar_url: avatarUrl,
            }
          : prev
      );
  
      Alert.alert("Success", "Profile picture updated.");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to upload image.");
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      setId(user.id ?? null);
      setEmail(user.email ?? "");

      const { data, error } = await supabase
        .from("profiles")
        .select("username, display_name, avatar_url, bio")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setBio(data.bio ?? "");
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
    router.replace("/(auth)/login");
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
          {profile?.display_name || email.split('@')[0]}
        </Text>

        <Text className="text-zinc-400 text-base mt-1">
          @{profile?.username}
        </Text>

        <Text className="text-zinc-500 mt-2">
          {email}
        </Text>

        <View className="w-full bg-zinc-900 rounded-3xl p-5 mt-8">
          <Text className="text-zinc-400 text-sm mb-2">
            Bio
          </Text>

          {editingBio ? (
            <View className="gap-3">
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us something about you..."
                placeholderTextColor="#71717a"
                multiline
                textAlignVertical="top"
                className="
                  text-white
                  text-base
                  min-h-[100px]
                  bg-zinc-800
                  p-4
                  rounded-xl
                "
              />
            
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => {
                    setBio(profile?.bio || "");
                    setEditingBio(false);
                  }}
                  className="bg-zinc-800 px-4 py-3 rounded-xl"
                >
                  <Text className="text-white">Cancel</Text>
                </Pressable>
            
                <Pressable
                  disabled={saving}
                  onPress={saveBio}
                  className="bg-green-600 px-4 py-3 rounded-xl"
                >
                  <Text className="text-white">
                    {saving ? "Saving..." : "Save"}
                  </Text>
                </Pressable>
              </View>
            </View>
            ) : (
            <Pressable onPress={() => setEditingBio(true)}>
              <Text className="text-white text-base">
                {bio || "Tell us something about you..."}
              </Text>
            </Pressable>
            )}
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