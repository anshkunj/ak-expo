import {View, Text, Pressable, TextInput, Alert} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import {router} from 'expo-router';
import {supabase} from '../../lib/supabase';

export default function LoginPage() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const handleLogin = async () => {
    const {data:{user},error} = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      Alert.alert("Login failed","Try again");
      return
    }
    consope.log(user);
    consope.log(error);
    router.push("/");
  }

  const handleSignup = async () => {
    const {data:{user},error} = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      Alert.alert("Sign Up failed","Try again");
      return
    }
    console.log(user);
    console.log(error);
    router.push("/");
  }
  
  return (
    <SafeAreaView className="justify-center gap-6 bg-black flex-1">
      <View className="justify-center gap-4 p-4">
        <Text className="text-4xl font-extrabold text-white">
          Expanse Tracker
        </Text>
        <Text className="text-[#666]">
          Track your Every Rupee
        </Text>
      </View>
      <View className="justify-center gap-4 p-4">
        <TextInput className="rounded-full border bg-white/80 p-4 text-black" placeholder="Email" keyboardType="email" value={email} onChangeText={setEmail} />
        <TextInput className="rounded-full border bg-white/80 p-4 text-black" placeholder="Password" keyboardType="password" value={password} onChangeText={setPassword} />
      </View>
      <View className="justify-center gap-4">  
        <Pressable onPress={handleSignup} className="mx-6 p-4 bg-white rounded-2xl">
          <Text className="text-black text-center">Sign Up</Text>
        </Pressable>
        <Pressable onPress={handleLogin} className="mx-6 p-4 bg-white rounded-2xl">
          <Text className="text-black text-center">Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}