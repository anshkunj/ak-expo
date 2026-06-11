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
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [expense, setExpense] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const initialize = async () => {
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

        await fetchData();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

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
    }
  }

  function goToProfile() {
    router.push("/profile");
  }

  async function createExpense() {
    try {
      if (!expense.trim()) return;

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log(userError);
        return;
      }

      const { error } = await supabase.from("expenses").insert({
        expense: expense.trim(),
        user_id: user.id,
      });

      if (error) {
        console.log(error);
        return;
      }

      setExpense("");
      await fetchData();
    } catch (error) {
      console.log(error);
    }
  }

  function confirmDelete(id) {
    Alert.alert("Delete Expense", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteExpense(id),
      },
    ]);
  }

  async function deleteExpense(id) {
    try {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);

      if (error) {
        console.log(error);
        return;
      }

      await fetchData();
    } catch (error) {
      console.log(error);
    }
  }

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

                <Pressable
                  hitSlop={10}
                  onPress={() => confirmDelete(item.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#ef4444"
                  />
                </Pressable>
              </View>

              <Text
                className="
                  text-white
                  text-base
                  mt-3
                "
              >
                {item.expense}
              </Text>
            </Pressable>
          )}
        />

        <View
          className="
            absolute
            left-0
            right-0
            bottom-0
            bg-zinc-950
            border-t
            border-zinc-800
            px-4
            py-4
          "
        >
          <View className="flex-row items-center gap-3">
            <TextInput
              value={expense}
              onChangeText={setExpense}
              placeholder="Add expense..."
              placeholderTextColor="#666"
              returnKeyType="done"
              onSubmitEditing={createExpense}
              className="
                flex-1
                bg-zinc-900
                text-white
                px-5
                py-4
                rounded-full
              "
            />

            <Pressable
              onPress={createExpense}
              className="
                bg-green-600
                px-6
                py-4
                rounded-full
                active:opacity-80
              "
            >
              <Text className="text-white font-bold">
                Add
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}