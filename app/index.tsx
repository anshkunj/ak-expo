import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [content, setContent] = useState("");

  async function fetchData() {
    const { data } = await supabase
      .from("expenses")
      .select()
      .order("id", { ascending: false });

    setExpenses(data || []);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function createExpense() {
    if (!content.trim()) return;

    await supabase.from("expenses").insert({
      content,
    });

    setContent("");
    fetchData();
  }

  function confirmDelete(id) {
    Alert.alert(
      "Delete Expense",
      "Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteExpense(id),
        },
      ]
    );
  }

  async function deleteExpense(id) {
    await supabase
      .from("expenses")
      .delete()
      .eq("id", id);
  
    fetchData();
  }

  const Header = () => (
    <View className="mb-8">
      <Text className="text-white text-4xl font-bold">
        Expense Tracker
      </Text>

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

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 140,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          ListHeaderComponent={<Header />}
          ListEmptyComponent={<EmptyState />}
          renderItem={({ item }) => (
            <View
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
                {item.content}
              </Text>
            </View>
          )}
        />

        {/* Bottom Input Bar */}

        <View
          className="
            absolute
            bottom-0
            left-0
            right-0
            bg-zinc-950
            border-t
            border-zinc-800
            px-4
            py-4
          "
        >
          <View className="flex-row items-center gap-3">
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Add expense..."
              placeholderTextColor="#666"
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
              "
            >
              <Text className="text-white font-bold">
                Add
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}