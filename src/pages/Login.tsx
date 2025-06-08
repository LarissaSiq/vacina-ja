import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SHA256 from "crypto-js/sha256";
import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../routes";

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function Login() {
  const navigation = useNavigation<LoginScreenProp>();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  function formatCPF(value: string) {
    const cpfNumbers = value.replace(/\D/g, "");
    let formatted = cpfNumbers;

    if (cpfNumbers.length > 3 && cpfNumbers.length <= 6) {
      formatted = cpfNumbers.replace(/(\d{3})(\d+)/, "$1.$2");
    } else if (cpfNumbers.length > 6 && cpfNumbers.length <= 9) {
      formatted = cpfNumbers.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    } else if (cpfNumbers.length > 9) {
      formatted = cpfNumbers.replace(
        /(\d{3})(\d{3})(\d{3})(\d+)/,
        "$1.$2.$3-$4"
      );
    }

    return formatted;
  }

  const handleLogin = async () => {
    const cpfClean = cpf.replace(/\D/g, "");
    if (cpfClean.length !== 11) {
      Alert.alert("Erro", "CPF inválido");
      return;
    }
    if (!senha) {
      Alert.alert("Erro", "Informe a senha");
      return;
    }

    try {
      const usersJson = await AsyncStorage.getItem("users");
      const users = usersJson ? JSON.parse(usersJson) : [];

      const hashedSenha = SHA256(senha).toString();

      const userFound = users.find(
        (u: { cpf: string; senha: string }) =>
          u.cpf === cpfClean && u.senha === hashedSenha
      );

      if (userFound) {
        await AsyncStorage.setItem("userLogado", JSON.stringify(userFound));

        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        Alert.alert("Erro", "CPF ou senha inválidos");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao tentar fazer login");
    }
  };

  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>Vacina Já</Text>
      <Text style={styles.subtitle}>Controle Digital de Vacinação</Text>

      <TextInput
        style={styles.input}
        placeholder="CPF"
        placeholderTextColor="#999"
        value={cpf}
        onChangeText={(text) => setCpf(formatCPF(text))}
        keyboardType="numeric"
        maxLength={14}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#999"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Cadastro")}
      >
        <Text style={styles.secondaryButtonText}>Primeiro acesso</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "rgba(133, 191, 227, 0.2)",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 2,
    textAlign: "center",
    color: "#333",
    fontFamily: "Roboto_700Bold",
    textTransform: "uppercase",
    fontStyle: "italic",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 72,
    textAlign: "center",
    color: "#333",
    fontFamily: "Roboto_700Bold",
    textTransform: "uppercase",
    fontStyle: "italic",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    color: "#333",
    backgroundColor: "#FFF",
    fontFamily: "Roboto_400Regular",
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 16,
  },
  inputPassword: {
    height: 48,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#333",
    backgroundColor: "#FFF",
    fontFamily: "Roboto_400Regular",
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto_700Bold",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto_700Bold",
  },
});
