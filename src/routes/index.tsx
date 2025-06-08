import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import Cadastro from "../pages/Cadastro";
import CadastroVacina from "../pages/CadastroVacina";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { Logout } from "../pages/Logout";
import Vacinas from "../pages/Vacinas";

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Home: { screen?: "Inicio" | "Vacinas" };
  CadastroVacina: { vacinaId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";

          if (route.name === "Inicio") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Vacinas") {
            iconName = focused ? "medkit" : "medkit-outline";
          } else if (route.name === "Sair") {
            iconName = focused ? "exit" : "exit-outline";
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Vacinas" component={Vacinas} />
      <Tab.Screen name="Sair" component={Logout} />
    </Tab.Navigator>
  );
}

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Home" component={MainTabs} />
        <Stack.Screen name="CadastroVacina" component={CadastroVacina} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
