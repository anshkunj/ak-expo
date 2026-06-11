import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";

export default function ChooseUsernamePage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    const value = username.trim().toLowerCase();

    const usernameRegex = /^[a-z0-9._]{3,30}$/;

    if (!usernameRegex.test(value)) {
      Alert.alert(
        "Invalid Username",
        "Username must be 3-30 characters and contain only letters, numbers, dots and underscores."
      );
      return;
    }

    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("Error", "User not found.");
        return;
      }

      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", value)
        .maybeSingle();

      if (existing) {
        Alert.alert(
          "Username Taken",
          "Please choose another username."
        );
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: value,
        })
        .eq("id", user.id);

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      router.replace("/");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 justify-center px-6">
        <Text className="text-white text-4xl font-extrabold">
          Choose Username
        </Text>

        <Text className="text-zinc-400 mt-3 text-base">
          Pick a unique username for your account.
        </Text>

        <TextInput
          value={username}
          onChangeText={(text) => setUsername(text.toLowerCase())}
          placeholder="username"
          placeholderTextColor="#71717a"
          autoCapitalize="none"
          autoCorrect={false}
          className="
            mt-8
            bg-zinc-900
            text-white
            px-5
            py-4
            rounded-2xl
            border
            border-zinc-800
          "
        />

        <Text className="text-zinc-500 mt-3">
          Allowed: a-z, 0-9, . and _
        </Text>

        <Pressable
          disabled={loading}
          onPress={handleContinue}
          className="
            mt-8
            bg-green-600
            py-4
            rounded-2xl
            items-center
          "
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              Continue
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}