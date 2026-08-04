import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import api from "@/services/api";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      Alert.alert(
        "Atenção",
        "Preencha o usuário e a senha."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/login/", {
        username: username.trim(),
        password,
      });

      await SecureStore.setItemAsync(
        "access_token",
        response.data.access
      );

      await SecureStore.setItemAsync(
        "refresh_token",
        response.data.refresh
      );

      router.replace("/home");
    } catch (error: any) {
      console.log(
        error.response?.data ?? error.message
      );

      let message =
  error.response?.data?.detail ??
  "Não foi possível conectar com o servidor.";

switch (message) {
  case "No active account found with the given credentials":
    message = "Usuário ou senha incorretos.";
    break;

  case "Token is invalid or expired":
    message = "Sua sessão expirou. Faça login novamente.";
    break;

  default:
    break;
}

Alert.alert("Erro no login", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>✓</Text>

        <Text style={styles.title}>Todo App</Text>

        <Text style={styles.subtitle}>
          Entre na sua conta para organizar suas tarefas
        </Text>

        <Text style={styles.label}>
          Usuário
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu usuário"
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
          editable={!loading}
        />

        <Text style={styles.label}>
          Senha
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          onSubmitEditing={handleLogin}
        />

        <Pressable
          style={styles.forgotPasswordButton}
          onPress={() =>
            router.push("/forgot-password")
          }
          disabled={loading}
        >
          <Text style={styles.forgotPasswordText}>
            Esqueci minha senha
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.pressedButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>
              Entrar
            </Text>
          )}
        </Pressable>

        <View style={styles.registerContainer}>
          <Text style={styles.registerQuestion}>
            Ainda não possui uma conta?
          </Text>

          <Pressable
            onPress={() =>
              router.push("/register")
            }
            disabled={loading}
          >
            <Text style={styles.registerLink}>
              Criar conta
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f5f7fb",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  logo: {
    alignSelf: "center",
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#208AEF",
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 58,
    marginBottom: 14,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#6b7280",
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 28,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 7,
  },

  input: {
    height: 52,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#111827",
  },

  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: -5,
    marginBottom: 16,
  },

  forgotPasswordText: {
    color: "#208AEF",
    fontSize: 14,
    fontWeight: "600",
  },

  loginButton: {
    height: 52,
    backgroundColor: "#208AEF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  loginButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 22,
  },

  registerQuestion: {
    color: "#6b7280",
    fontSize: 14,
  },

  registerLink: {
    color: "#208AEF",
    fontSize: 14,
    fontWeight: "bold",
  },

  pressedButton: {
    opacity: 0.8,
  },

  disabledButton: {
    opacity: 0.6,
  },
});