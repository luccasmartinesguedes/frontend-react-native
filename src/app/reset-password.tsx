import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import api from "@/services/api";

type ResetError = {
  detail?: string;
  non_field_errors?: string[];
  uid?: string[];
  token?: string[];
  password?: string[];
};

export default function ResetPasswordScreen() {
  const [uid, setUid] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] =
    useState("");
  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = useState("");
  const [loading, setLoading] =
    useState(false);

  function getErrorMessage(
    data?: ResetError
  ) {
    if (!data) {
      return "Não foi possível redefinir a senha.";
    }

    if (data.non_field_errors?.length) {
      return data.non_field_errors[0];
    }

    if (data.uid?.length) {
      return data.uid[0];
    }

    if (data.token?.length) {
      return data.token[0];
    }

    if (data.password?.length) {
      return data.password[0];
    }

    if (data.detail) {
      return data.detail;
    }

    return "Não foi possível redefinir a senha.";
  }

  async function handleResetPassword() {
    if (
      !uid.trim() ||
      !token.trim() ||
      !password ||
      !passwordConfirmation
    ) {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos."
      );
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Senha inválida",
        "A nova senha deve ter pelo menos 8 caracteres."
      );
      return;
    }

    if (password !== passwordConfirmation) {
      Alert.alert(
        "Senhas diferentes",
        "A nova senha e a confirmação não coincidem."
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/reset-password/", {
        uid: uid.trim(),
        token: token.trim(),
        password,
      });

      Alert.alert(
        "Senha redefinida",
        "Sua senha foi alterada com sucesso.",
        [
          {
            text: "Ir para o login",
            onPress: () =>
              router.replace("/"),
          },
        ]
      );
    } catch (error: any) {
      console.log(
        error.response?.data ?? error.message
      );

      Alert.alert(
        "Erro na redefinição",
        getErrorMessage(
          error.response?.data
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            Redefinir senha
          </Text>

          <Text style={styles.subtitle}>
            Copie o UID e o token exibidos no
            terminal do Django.
          </Text>

          <Text style={styles.label}>UID</Text>

          <TextInput
            style={styles.input}
            placeholder="Cole o UID"
            autoCapitalize="none"
            autoCorrect={false}
            value={uid}
            onChangeText={setUid}
            editable={!loading}
          />

          <Text style={styles.label}>
            Token
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Cole o token"
            autoCapitalize="none"
            autoCorrect={false}
            value={token}
            onChangeText={setToken}
            editable={!loading}
          />

          <Text style={styles.label}>
            Nova senha
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Mínimo de 8 caracteres"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />

          <Text style={styles.label}>
            Confirmar nova senha
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite novamente"
            secureTextEntry
            value={passwordConfirmation}
            onChangeText={
              setPasswordConfirmation
            }
            editable={!loading}
            onSubmitEditing={
              handleResetPassword
            }
          />

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed &&
                styles.pressedButton,
              loading &&
                styles.disabledButton,
            ]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                color="#ffffff"
              />
            ) : (
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Redefinir senha
              </Text>
            )}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    color: "#6b7280",
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 26,
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
    marginBottom: 15,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#ffffff",
  },

  primaryButton: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#208AEF",
    marginTop: 5,
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
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