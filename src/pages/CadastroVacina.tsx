import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { isFuture, isValid, parse } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../routes";

type Props = NativeStackScreenProps<RootStackParamList, "CadastroVacina">;

export default function CadastroVacina({ navigation, route }: Props) {
  const [nomeVacina, setNomeVacina] = useState("");
  const [dataAplicacao, setDataAplicacao] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erroNome, setErroNome] = useState("");
  const [erroData, setErroData] = useState("");

  useEffect(() => {
    if (route.params?.vacinaId) {
      carregarVacinaParaEditar(route.params.vacinaId);
    }
  }, [route.params]);

  const carregarVacinaParaEditar = async (id: string) => {
    const vacinasSalvas = await AsyncStorage.getItem("vacinas");
    const vacinas = vacinasSalvas ? JSON.parse(vacinasSalvas) : [];
    const vacina = vacinas.find((v: any) => v.id === id);
    if (vacina) {
      setNomeVacina(vacina.nome);
      setDataAplicacao(vacina.data);
      setEditandoId(vacina.id);
    }
  };

  const formatarData = (text: string) => {
    const numeros = text.replace(/\D/g, "");
    let formatted = "";

    if (numeros.length > 0) {
      formatted += numeros.substring(0, 2);
    }
    if (numeros.length > 2) {
      formatted += "/" + numeros.substring(2, 4);
    }
    if (numeros.length > 4) {
      formatted += "/" + numeros.substring(4, 8);
    }

    return formatted;
  };

  const validarData = (data: string) => {
    const parsedDate = parse(data, "dd/MM/yyyy", new Date());
    if (!isValid(parsedDate)) return false;
    if (isFuture(parsedDate)) return false;
    return true;
  };

  const handleSalvar = async () => {
    setErroNome("");
    setErroData("");

    let valid = true;
    if (!nomeVacina.trim()) {
      setErroNome("Informe o nome da vacina.");
      valid = false;
    }

    if (!dataAplicacao.trim() || !validarData(dataAplicacao.trim())) {
      setErroData("Data inválida. Use DD/MM/AAAA e data não futura.");
      valid = false;
    }

    if (!valid) return;

    try {
      const vacinasSalvas = await AsyncStorage.getItem("vacinas");
      const vacinas = vacinasSalvas ? JSON.parse(vacinasSalvas) : [];

      if (editandoId) {
        const index = vacinas.findIndex((v: any) => v.id === editandoId);
        if (index !== -1) {
          vacinas[index] = {
            id: editandoId,
            nome: nomeVacina.trim(),
            data: dataAplicacao.trim(),
          };
        }
      } else {
        const novaVacina = {
          id: Date.now().toString(),
          nome: nomeVacina.trim(),
          data: dataAplicacao.trim(),
        };
        vacinas.push(novaVacina);
      }

      await AsyncStorage.setItem("vacinas", JSON.stringify(vacinas));

      Alert.alert(
        "Sucesso",
        `Vacina ${editandoId ? "atualizada" : "cadastrada"} com sucesso!`,
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("Home", {
                screen: "Vacinas",
              }),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a vacina.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Cadastro de Vacina</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Nome da vacina</Text>
        <TextInput
          style={[styles.input, erroNome ? styles.inputErro : null]}
          value={nomeVacina}
          onChangeText={setNomeVacina}
          placeholder="Ex: Hepatite B"
          placeholderTextColor="#bbb"
          autoCapitalize="words"
        />
        {!!erroNome && <Text style={styles.erroTexto}>{erroNome}</Text>}

        <Text style={styles.label}>Data de aplicação</Text>
        <TextInput
          style={[styles.input, erroData ? styles.inputErro : null]}
          value={dataAplicacao}
          onChangeText={(text) => setDataAplicacao(formatarData(text))}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#bbb"
          keyboardType="numeric"
          maxLength={10}
        />
        {!!erroData && <Text style={styles.erroTexto}>{erroData}</Text>}

        <TouchableOpacity
          style={styles.botaoSalvar}
          activeOpacity={0.8}
          onPress={handleSalvar}
        >
          <Text style={styles.botaoTexto}>
            {editandoId ? "Atualizar" : "Salvar"}
          </Text>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  backButton: {
    left: 0,
    position: "absolute",
    paddingHorizontal: 16,
  },
  content: {
    padding: 24,
  },
  label: {
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#222",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  inputErro: {
    borderColor: "#FF3B30",
  },
  erroTexto: {
    color: "#FF3B30",
    marginBottom: 12,
    fontWeight: "600",
  },
  botaoSalvar: {
    marginTop: 32,
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
