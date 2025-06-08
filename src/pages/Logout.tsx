import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { RootStackParamList } from "../routes";

type LogoutScreenProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export function Logout() {
  const navigation = useNavigation<LogoutScreenProp>();

  useEffect(() => {
    const doLogout = async () => {
      await AsyncStorage.removeItem("usuarioLogado");
      navigation.replace("Login");
    };
    doLogout();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
