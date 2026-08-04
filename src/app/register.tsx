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

type RegisterError = {
  username?: string[];
  email?: string[];
  password?: string[];
  detail?: string;
};

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] =
    useState("");
  const [loading, setLoading] = useState(false);

  function validateForm() {
    if (
      !username.trim() ||
      !email.trim() ||
      !password ||
      !passwordConfirmation
    ) {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos."
      );
      return false;
    }

    if (!email.includes("@")) {
      Alert.alert(
        "E-mail inválido",
        "Digite um endereço de e-mail válido."
      );
      return false;
    }

    if (username.trim().length < 3) {
      Alert.alert(
        "Usuário inválido",
        "O nome de usuário deve ter pelo menos 3 caracteres."
      );
      return false;
    }

    if (password.length < 8) {
      Alert.alert(
        "Senha inválida",
        "A senha deve ter pelo menos 8 caracteres."
      );
      return false;
    }

    if (password !== passwordConfirmation) {
      Alert.alert(
        "Senhas diferentes",
        "A senha e a confirmação não coincidem."
      );
      return false;
    }

    return true;
  }

  function getRegisterErrorMessage(
    data?: RegisterError
  ) {
    if (!data) {
      return "Não foi possível criar a conta.";
    }

    if (data.username?.length) {
      return data.username[0];
    }

    if (data.email?.length) {
      return data.email[0];
    }

    if (data.password?.length) {
      return data.password[0];
    }

    if (data.detail) {
      return data.detail;
    }

    return "Não foi possível criar a conta.";
  }

  async function handleRegister() {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await api.post("/register/", {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      Alert.alert(
        "Conta criada",
        "Seu cadastro foi realizado com sucesso. Agora você pode entrar.",
        [
          {
            text: "Ir para o login",
            onPress: () => router.replace("/"),
          },
        ]
      );
    } catch (error: any) {
      console.log(
        error.response?.data ?? error.message
      );

      Alert.alert(
        "Erro no cadastro",
        getRegisterErrorMessage(
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
        Platform.OS === "ios" ? "padding" : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            Criar conta
          </Text>

          <Text style={styles.subtitle}>
            Cadastre-se para começar a organizar suas tarefas
          </Text>

          <Text style={styles.label}>
            Nome de usuário
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Escolha um nome de usuário"
            autoCapitalize="none"
            autoCorrect={false}
            value={username}
            onChangeText={setUsername}
            maxLength={150}
            editable={!loading}
          />

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
          />

          <Text style={styles.label}>Senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Mínimo de 8 caracteres"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />

          <Text style={styles.label}>
            Confirmar senha
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite novamente sua senha"
            secureTextEntry
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            editable={!loading}
            onSubmitEditing={handleRegister}
          />

          <Pressable
            style={({ pressed }) => [
              styles.registerButton,
              pressed && styles.pressedButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text
                style={styles.registerButtonText}
              >
                Criar conta
              </Text>
            )}
          </Pressable>

          <View style={styles.loginContainer}>
            <Text style={styles.loginQuestion}>
              Já possui uma conta?
            </Text>

            <Pressable
              onPress={() => router.replace("/")}
              disabled={loading}
            >
              <Text style={styles.loginLink}>
                Entrar
              </Text>
            </Pressable>
          </View>
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
    fontSize: 28,
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
    marginBottom: 26,
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
    marginBottom: 15,
    fontSize: 16,
    color: "#111827",
  },

  registerButton: {
    height: 52,
    backgroundColor: "#208AEF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  registerButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 22,
  },

  loginQuestion: {
    color: "#6b7280",
    fontSize: 14,
  },

  loginLink: {
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