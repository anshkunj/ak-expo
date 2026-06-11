import {
  View,
  Text,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      if (!email.trim() || !password.trim()) {
        Alert.alert("Missing fields", "Please enter email and password.");
        return;
      }

      setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert("Login Failed", error.message);
        return;
      }

      if (user) {
        router.replace("/");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup() {
    try {
      if (!email.trim() || !password.trim()) {
        Alert.alert("Missing fields", "Please enter email and password.");
        return;
      }

      setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert("Sign Up Failed", error.message);
        return;
      }

      if (user) {
        router.replace("/");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-black">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View className="mb-12">
            <Text className="text-white text-4xl font-extrabold">
              Expense Tracker
            </Text>

            <Text className="text-zinc-400 mt-3 text-base">
              Track every rupee you spend
            </Text>
          </View>

          <View className="gap-4">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#71717a"
              keyboardType="email-address"
              autoCapitalize="none"
              className="
                bg-zinc-900
                text-white
                px-5
                py-4
                rounded-2xl
                border
                border-zinc-800
              "
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#71717a"
              secureTextEntry
              className="
                bg-zinc-900
                text-white
                px-5
                py-4
                rounded-2xl
                border
                border-zinc-800
              "
            />
          </View>

          <View className="gap-4 mt-8">
            <Pressable
              disabled={loading}
              onPress={handleLogin}
              className="
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
                  Login
                </Text>
              )}
            </Pressable>

            <Pressable
              disabled={loading}
              onPress={handleSignup}
              className="
                bg-zinc-900
                py-4
                rounded-2xl
                items-center
                border
                border-zinc-800
              "
            >
              <Text className="text-white font-semibold text-base">
                Create Account
              </Text>
            </Pressable>
          </View>

          <Text className="text-zinc-500 text-center mt-8">
            Manage expenses simply and efficiently
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}