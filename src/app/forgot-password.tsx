import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import api from "@/services/api";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword() {
    if (!email.trim()) {
      Alert.alert(
        "Atenção",
        "Digite o e-mail cadastrado."
      );
      return;
    }

    if (!email.includes("@")) {
      Alert.alert(
        "E-mail inválido",
        "Digite um endereço de e-mail válido."
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/forgot-password/", {
        email: email.trim().toLowerCase(),
      });

      Alert.alert(
        "Solicitação enviada",
        "Se o e-mail estiver cadastrado, o UID e o token aparecerão no terminal do Django.",
        [
          {
            text: "Redefinir senha",
            onPress: () =>
              router.push("/reset-password"),
          },
        ]
      );
    } catch (error: any) {
      console.log(
        error.response?.data ?? error.message
      );

      Alert.alert(
        "Erro",
        "Não foi possível solicitar a recuperação de senha."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.card}>
        <Text style={styles.icon}>🔐</Text>

        <Text style={styles.title}>
          Recuperar senha
        </Text>

        <Text style={styles.subtitle}>
          Informe o e-mail cadastrado. As
          instruções aparecerão no terminal do
          backend durante o desenvolvimento.
        </Text>

        <Text style={styles.label}>E-mail</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          onSubmitEditing={
            handleForgotPassword
          }
        />

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressedButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleForgotPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.primaryButtonText}>
              Enviar instruções
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() =>
            router.push("/reset-password")
          }
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>
            Já tenho o UID e o token
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/")}
          disabled={loading}
        >
          <Text style={styles.backLink}>
            Voltar para o login
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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

  icon: {
    fontSize: 44,
    textAlign: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 26,
    color: "#6b7280",
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
  },

  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 7,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
    marginBottom: 16,
  },

  primaryButton: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#208AEF",
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  secondaryButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#208AEF",
    marginTop: 12,
  },

  secondaryButtonText: {
    color: "#208AEF",
    fontWeight: "bold",
  },

  backLink: {
    color: "#6b7280",
    textAlign: "center",
    marginTop: 22,
    fontWeight: "600",
  },

  pressedButton: {
    opacity: 0.8,
  },

  disabledButton: {
    opacity: 0.6,
  },
});