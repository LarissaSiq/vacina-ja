import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../routes";

interface Vacina {
  id: string;
  nome: string;
  data: string;
}

type VacinasScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  "Vacinas"
>;

export default function Vacinas() {
  const navigation = useNavigation<VacinasScreenProp>();
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  const carregarVacinas = useCallback(async () => {
    setLoading(true);
    try {
      const json = await AsyncStorage.getItem("vacinas");
      setVacinas(json ? JSON.parse(json) : []);
    } catch (error) {
      console.error("Erro ao carregar vacinas:", error);
      Alert.alert("Erro", "Não foi possível carregar suas vacinas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarVacinas();
    }, [carregarVacinas])
  );

  const excluirVacina = useCallback(
    (id: string) => {
      Alert.alert(
        "Confirmar exclusão",
        "Deseja realmente excluir esta vacina?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: async () => {
              try {
                const atualizadas = vacinas.filter((v) => v.id !== id);
                setVacinas(atualizadas);
                await AsyncStorage.setItem(
                  "vacinas",
                  JSON.stringify(atualizadas)
                );
              } catch (error) {
                console.error("Erro ao excluir vacina:", error);
                Alert.alert("Erro", "Não foi possível excluir a vacina.");
              }
            },
          },
        ]
      );
    },
    [vacinas]
  );

  const vacinasFiltradas = vacinas.filter((v) =>
    v.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const renderItem = ({ item }: { item: Vacina }) => (
    <View style={styles.card}>
      <View style={styles.cardText}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.data}>Data: {item.data}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("CadastroVacina", { vacinaId: item.id })
          }
        >
          <Feather name="edit-2" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => excluirVacina(item.id)}
        >
          <Feather name="trash-2" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Vacinas</Text>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar vacina"
          placeholderTextColor="#999"
          value={filtro}
          onChangeText={setFiltro}
        />
      </View>

      <FlatList
        data={vacinasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          vacinasFiltradas.length === 0 && styles.emptyContainer
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma vacina cadastrada.</Text>
        }
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("CadastroVacina", {})}
        accessibilityLabel="Adicionar vacina"
      >
        <Feather name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const baseCardShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(98, 170, 213, 0.11)",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    justifyContent: "space-between",
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
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    ...baseCardShadow,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    alignItems: "center",
    ...baseCardShadow,
  },
  cardText: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  data: {
    marginTop: 4,
    fontSize: 14,
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 8,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
  floatingButton: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    ...baseCardShadow,
  },
});
