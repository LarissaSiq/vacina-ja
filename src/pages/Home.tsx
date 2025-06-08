import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../routes";

type HomeScreenProp = NativeStackNavigationProp<RootStackParamList, "Home">;

type Vacina = {
  nome: string;
  dataProximaDose: string; // ISO: "YYYY-MM-DD"
};

export default function Home() {
  const navigation = useNavigation<HomeScreenProp>();
  const [usuarioNome, setUsuarioNome] = useState<string | null>(null);
  const [proximaVacina, setProximaVacina] = useState<Vacina | null>(null);

  const obterUsuarioLogado = useCallback(async () => {
    try {
      const usuarioString = await AsyncStorage.getItem("userLogado");
      if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        if (usuario.nome) setUsuarioNome(usuario.nome);
      }
    } catch (error) {
      console.error("Erro ao carregar usuário logado:", error);
    }
  }, []);

  const encontrarProximaVacina = useCallback(async () => {
    try {
      const vacinasString = await AsyncStorage.getItem("vacinas");
      if (!vacinasString) return;

      const vacinas: Vacina[] = JSON.parse(vacinasString);
      const hoje = new Date();

      const futuras = vacinas.filter(
        (v) => new Date(v.dataProximaDose) >= hoje
      );

      if (futuras.length === 0) return;

      const maisProxima = futuras.reduce((a, b) =>
        new Date(a.dataProximaDose) < new Date(b.dataProximaDose) ? a : b
      );

      setProximaVacina(maisProxima);
    } catch (error) {
      console.error("Erro ao carregar vacinas:", error);
    }
  }, []);

  useEffect(() => {
    obterUsuarioLogado();
    encontrarProximaVacina();
  }, [obterUsuarioLogado, encontrarProximaVacina]);

  const handleCadastro = () => navigation.navigate("CadastroVacina", {});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Início</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>
          Olá{usuarioNome ? `, ${usuarioNome}` : ""}!
        </Text>

        {proximaVacina ? (
          <View style={styles.avisoContainer}>
            <Text style={styles.avisoTexto}>
              Próxima vacinação:{" "}
              <Text style={styles.vacinaNome}>{proximaVacina.nome}</Text>
              {"\n"}Data:{" "}
              <Text style={styles.vacinaData}>
                {new Date(proximaVacina.dataProximaDose).toLocaleDateString(
                  "pt-BR"
                )}
              </Text>
            </Text>
          </View>
        ) : (
          <View style={styles.semVacinasContainer}>
            <Text style={styles.semVacinasTexto}>
              Você não tem vacinas agendadas no momento.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={handleCadastro}
        >
          <Text style={styles.buttonText}>Cadastrar Vacina</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(98, 170, 213, 0.11)",
  },
  header: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    width: "100%",
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    flex: 1,
  },
  text: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 30,
    textAlign: "center",
  },
  avisoContainer: {
    backgroundColor: "#FFF3CD",
    borderColor: "#FFEEBA",
    borderWidth: 1,
    padding: 16,
    borderRadius: 14,
    marginBottom: 25,
    width: "85%",
    shadowColor: "#B8860B",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  avisoTexto: {
    color: "#856404",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 18,
  },
  vacinaNome: {
    fontWeight: "800",
    color: "#7B4B00",
  },
  vacinaData: {
    fontWeight: "700",
  },
  semVacinasContainer: {
    padding: 20,
    backgroundColor: "#E8F0FE",
    borderRadius: 12,
    marginBottom: 25,
    width: "85%",
  },
  semVacinasTexto: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontStyle: "italic",
  },
  button: {
    width: "80%",
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    textTransform: "uppercase",
  },
});
