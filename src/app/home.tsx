import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "@/services/tasks";

type Task = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  created_at: string;
};

type StatusFilter = "all" | "pending" | "completed";

function formatDate(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatDateOnly(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

function formatDateInput(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 8);

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  }

  return `${numbers.slice(0, 2)}/${numbers.slice(
    2,
    4
  )}/${numbers.slice(4)}`;
}

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);

        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.log(error);

        Alert.alert(
          "Erro",
          "Não foi possível carregar as tarefas."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  function clearForm() {
    setEditingTask(null);
    setTitle("");
    setDescription("");
  }

  function openCreateModal() {
    clearForm();
    setModalVisible(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description ?? "");
    setModalVisible(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    clearForm();
    setModalVisible(false);
  }

  async function handleSaveTask() {
    if (!title.trim()) {
      Alert.alert(
        "Atenção",
        "Digite um título para a tarefa."
      );
      return;
    }

    try {
      setSaving(true);

      if (editingTask) {
        const updatedTask = await updateTask(
          editingTask.id,
          {
            title: title.trim(),
            description: description.trim(),
          }
        );

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === editingTask.id
              ? updatedTask
              : task
          )
        );
      } else {
        const newTask = await createTask(
          title.trim(),
          description.trim()
        );

        setTasks((currentTasks) => [
          newTask,
          ...currentTasks,
        ]);
      }

      setModalVisible(false);
      clearForm();
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Erro",
        editingTask
          ? "Não foi possível atualizar a tarefa."
          : "Não foi possível criar a tarefa."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(task: Task) {
    try {
      const newStatus =
        task.status === "pending"
          ? "completed"
          : "pending";

      const updatedTask = await updateTask(
        task.id,
        {
          status: newStatus,
        }
      );

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id
            ? updatedTask
            : currentTask
        )
      );
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível atualizar a tarefa."
      );
    }
  }

  function handleDeleteTask(id: number) {
    Alert.alert(
      "Excluir tarefa",
      "Deseja realmente excluir esta tarefa?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTask(id);

              setTasks((currentTasks) =>
                currentTasks.filter(
                  (task) => task.id !== id
                )
              );
            } catch (error) {
              console.log(error);

              Alert.alert(
                "Erro",
                "Não foi possível excluir a tarefa."
              );
            }
          },
        },
      ]
    );
  }

  function handleLogout() {
    Alert.alert(
      "Sair",
      "Deseja realmente sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync(
                "access_token"
              );

              await SecureStore.deleteItemAsync(
                "refresh_token"
              );

              router.replace("/");
            } catch (error) {
              console.log(error);

              Alert.alert(
                "Erro",
                "Não foi possível sair da conta."
              );
            }
          },
        },
      ]
    );
  }

  function clearFilters() {
    setStatusFilter("all");
    setDateFilter("");
  }

  const pendingCount = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const totalCount = tasks.length;

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === "all" ||
      task.status === statusFilter;

    const matchesDate =
  !dateFilter ||
  formatDateOnly(task.created_at).startsWith(
    dateFilter
  );

    return matchesStatus && matchesDate;
  });

  const filtersAreActive =
    statusFilter !== "all" || dateFilter.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>
          Minhas tarefas
        </Text>

        <View style={styles.headerButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.pressedButton,
            ]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>
              Sair
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressedButton,
            ]}
            onPress={openCreateModal}
          >
            <Text style={styles.addButtonText}>
              + Nova
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            Pendentes
          </Text>
          <Text
            style={[
              styles.summaryNumber,
              styles.pendingNumber,
            ]}
          >
            {pendingCount}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            Concluídas
          </Text>
          <Text
            style={[
              styles.summaryNumber,
              styles.completedNumber,
            ]}
          >
            {completedCount}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            Total
          </Text>
          <Text
            style={[
              styles.summaryNumber,
              styles.totalNumber,
            ]}
          >
            {totalCount}
          </Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>
            Filtrar tarefas
          </Text>

          {filtersAreActive && (
            <Pressable onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>
                Limpar filtros
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.statusFilterRow}>
          <Pressable
            style={[
              styles.filterChip,
              statusFilter === "all" &&
                styles.filterChipActive,
            ]}
            onPress={() => setStatusFilter("all")}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === "all" &&
                  styles.filterChipTextActive,
              ]}
            >
              Todas
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              statusFilter === "pending" &&
                styles.filterChipActive,
            ]}
            onPress={() =>
              setStatusFilter("pending")
            }
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === "pending" &&
                  styles.filterChipTextActive,
              ]}
            >
              Pendentes
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              statusFilter === "completed" &&
                styles.filterChipActive,
            ]}
            onPress={() =>
              setStatusFilter("completed")
            }
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === "completed" &&
                  styles.filterChipTextActive,
              ]}
            >
              Concluídas
            </Text>
          </Pressable>
        </View>

        <Text style={styles.dateFilterLabel}>
          Data de criação
        </Text>

        <TextInput
          style={styles.dateFilterInput}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
          maxLength={10}
          value={dateFilter}
          onChangeText={(value) =>
            setDateFilter(formatDateInput(value))
          }
        />

        <Text style={styles.filterResultText}>
          Exibindo {filteredTasks.length} de{" "}
          {tasks.length} tarefa
          {tasks.length === 1 ? "" : "s"}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#208AEF"
          />

          <Text style={styles.loadingText}>
            Carregando tarefas...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) =>
            item.id.toString()
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            filteredTasks.length === 0 &&
              styles.emptyListContent,
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>
                {filtersAreActive ? "🔎" : "📋"}
              </Text>

              <Text style={styles.emptyTitle}>
                {filtersAreActive
                  ? "Nenhuma tarefa encontrada"
                  : "Nenhuma tarefa por enquanto"}
              </Text>

              <Text style={styles.emptyText}>
                {filtersAreActive
                  ? "Altere ou limpe os filtros para visualizar outras tarefas."
                  : "Toque em “+ Nova” para criar sua primeira tarefa."}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isCompleted =
              item.status === "completed";

            return (
              <View
                style={[
                  styles.card,
                  isCompleted &&
                    styles.completedCard,
                ]}
              >
                <Text
                  style={[
                    styles.taskTitle,
                    isCompleted &&
                      styles.completedText,
                  ]}
                >
                  {item.title}
                </Text>

                {!!item.description && (
                  <Text
                    style={[
                      styles.description,
                      isCompleted &&
                        styles.completedText,
                    ]}
                  >
                    {item.description}
                  </Text>
                )}

                <Text style={styles.createdAt}>
                  Criada em{" "}
                  {formatDate(item.created_at)}
                </Text>

                <View
                  style={styles.statusContainer}
                >
                  <Text
                    style={[
                      styles.status,
                      isCompleted
                        ? styles.completedStatus
                        : styles.pendingStatus,
                    ]}
                  >
                    {isCompleted
                      ? "✅ Concluída"
                      : "⏳ Pendente"}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.editButton,
                      pressed &&
                        styles.pressedButton,
                    ]}
                    onPress={() =>
                      openEditModal(item)
                    }
                  >
                    <Text style={styles.editText}>
                      ✏️ Editar
                    </Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButton,
                      pressed &&
                        styles.pressedButton,
                    ]}
                    onPress={() =>
                      handleToggleStatus(item)
                    }
                  >
                    <Text style={styles.actionText}>
                      {isCompleted
                        ? "↩️ Reabrir"
                        : "✅ Concluir"}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.deleteButton,
                      pressed &&
                        styles.pressedButton,
                    ]}
                    onPress={() =>
                      handleDeleteTask(item.id)
                    }
                  >
                    <Text style={styles.deleteText}>
                      🗑️ Excluir
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTask
                ? "Editar tarefa"
                : "Nova tarefa"}
            </Text>

            <Text style={styles.inputLabel}>
              Título
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex.: Preparar apresentação"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              editable={!saving}
            />

            <Text style={styles.inputLabel}>
              Descrição
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.descriptionInput,
              ]}
              placeholder="Adicione mais detalhes"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              editable={!saving}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed &&
                    styles.pressedButton,
                ]}
                onPress={closeModal}
                disabled={saving}
              >
                <Text
                  style={styles.cancelButtonText}
                >
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed &&
                    styles.pressedButton,
                  saving &&
                    styles.disabledButton,
                ]}
                onPress={handleSaveTask}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator
                    color="#ffffff"
                  />
                ) : (
                  <Text
                    style={styles.saveButtonText}
                  >
                    {editingTask
                      ? "Atualizar"
                      : "Salvar"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#f5f7fb",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  pageTitle: {
    flexShrink: 1,
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
  },

  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },

  addButton: {
    backgroundColor: "#208AEF",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
  },

  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },

  logoutButton: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
  },

  logoutButtonText: {
    color: "#374151",
    fontWeight: "bold",
    fontSize: 14,
  },

  pressedButton: {
    opacity: 0.75,
  },

  summaryContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  summaryCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
  },

  summaryLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },

  summaryNumber: {
    fontSize: 22,
    fontWeight: "bold",
  },

  pendingNumber: {
    color: "#d97706",
  },

  completedNumber: {
    color: "#16a34a",
  },

  totalNumber: {
    color: "#208AEF",
  },

  filterContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },

  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },

  clearFiltersText: {
    color: "#208AEF",
    fontSize: 13,
    fontWeight: "600",
  },

  statusFilterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },

  filterChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 6,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 9,
  },

  filterChipActive: {
    backgroundColor: "#208AEF",
    borderColor: "#208AEF",
  },

  filterChipText: {
    color: "#4b5563",
    fontSize: 12,
    fontWeight: "600",
  },

  filterChipTextActive: {
    color: "#ffffff",
  },

  dateFilterLabel: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 7,
  },

  dateFilterInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 9,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#ffffff",
  },

  filterResultText: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 9,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#6b7280",
  },

  listContent: {
    paddingBottom: 24,
  },

  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },

  emptyText: {
    marginTop: 8,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 21,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  completedCard: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },

  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  description: {
    marginTop: 6,
    color: "#4b5563",
    lineHeight: 20,
  },

  createdAt: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 12,
    color: "#6b7280",
  },

  completedText: {
    textDecorationLine: "line-through",
    color: "#6b7280",
  },

  statusContainer: {
    alignItems: "flex-start",
    marginTop: 12,
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: "hidden",
    fontWeight: "600",
  },

  pendingStatus: {
    color: "#92400e",
    backgroundColor: "#fef3c7",
  },

  completedStatus: {
    color: "#166534",
    backgroundColor: "#dcfce7",
  },

  actions: {
    flexDirection: "row",
    gap: 7,
    marginTop: 16,
  },

  editButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6b7280",
    paddingHorizontal: 7,
    paddingVertical: 11,
    borderRadius: 9,
  },

  editText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 12,
  },

  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#208AEF",
    paddingHorizontal: 7,
    paddingVertical: 11,
    borderRadius: 9,
  },

  actionText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 12,
  },

  deleteButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dc2626",
    paddingHorizontal: 7,
    paddingVertical: 11,
    borderRadius: 9,
  },

  deleteText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 12,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 18,
  },

  inputLabel: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: 7,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: "#ffffff",
  },

  descriptionInput: {
    height: 100,
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },

  cancelButton: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
  },

  cancelButtonText: {
    fontWeight: "bold",
    color: "#374151",
  },

  saveButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#208AEF",
  },

  saveButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  disabledButton: {
    opacity: 0.6,
  },
});