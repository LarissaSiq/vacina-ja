import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
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

type Props = NativeStackScreenProps<RootStackParamList, "Cadastro">;

interface User {
  cpf: string;
  senha: string;
  nome?: string;
  vacinas?: string[];
}

const formatarCPF = (value: string): string =>
  value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const validarCPF = (cpf: string): boolean =>
  cpf.replace(/\D/g, "").length === 11;

export default function Cadastro({ navigation }: Props) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = useState(false);

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) return <AppLoading />;

  const handleCadastro = async () => {
    if (!nome.trim() || !cpf || !senha || !confirmaSenha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    if (!validarCPF(cpf)) {
      Alert.alert("Erro", "CPF inválido");
      return;
    }

    if (senha !== confirmaSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    try {
      const usersJson = await AsyncStorage.getItem("users");
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      const cpfClean = cpf.replace(/\D/g, "");

      if (users.some((u) => u.cpf === cpfClean)) {
        Alert.alert("Erro", "CPF já cadastrado");
        return;
      }

      const novoUser: User = {
        cpf: cpfClean,
        senha: SHA256(senha).toString(),
        nome: nome.trim(),
      };

      users.push(novoUser);
      await AsyncStorage.setItem("users", JSON.stringify(users));
      await AsyncStorage.setItem("userLogado", JSON.stringify(novoUser));

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch {
      Alert.alert("Erro", "Não foi possível cadastrar");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color="#007AFF" />
        <Text style={styles.backButtonText}>Voltar para o Login</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={(text) => setCpf(formatarCPF(text))}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setMostrarSenha(!mostrarSenha)}
        >
          <Feather
            name={mostrarSenha ? "eye" : "eye-off"}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Confirme a senha"
          value={confirmaSenha}
          onChangeText={setConfirmaSenha}
          secureTextEntry={!mostrarConfirmaSenha}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setMostrarConfirmaSenha(!mostrarConfirmaSenha)}
        >
          <Feather
            name={mostrarConfirmaSenha ? "eye" : "eye-off"}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(133, 191, 227, 0.2)",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 48,
    left: 20,
  },
  backButtonText: {
    paddingLeft: 5,
    fontSize: 14,
    fontWeight: "700",
    color: "#007AFF",
    fontFamily: "Roboto_700Bold",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 34,
    textAlign: "center",
    color: "#333",
    fontFamily: "Roboto_700Bold",
    textTransform: "uppercase",
    fontStyle: "italic",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
    color: "#333",
  },
  inputContainer: {
    position: "relative",
    marginBottom: 16,
  },
  inputWithIcon: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
    color: "#333",
    paddingRight: 40,
  },
  icon: {
    position: "absolute",
    right: 12,
    top: 14,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Roboto_700Bold",
  },
});
