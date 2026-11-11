// app/(auth)/login.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";
import { container } from "../../src/di/container";
import { useStore } from "../../src/store/useStore";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Nieznany błąd";
}

export default function LoginScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme()];
  const login = useStore((state) => state.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password)
      return Alert.alert("Błąd", "Wypełnij wszystkie pola");
    try {
      setLoading(true);
      const user = await container.registerUserUseCase.execute(
        username,
        password,
      );
      login(user.id);
      Alert.alert("Sukces", "Konto zostało utworzone!");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Błąd rejestracji", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username || !password)
      return Alert.alert("Błąd", "Wypełnij wszystkie pola");
    try {
      setLoading(true);
      const user = await container.loginUserUseCase.execute(username, password);
      login(user.id);
      Alert.alert("Sukces", "Zalogowano pomyślnie!");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Błąd logowania", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.screenBackground }]}
    >
      <Text style={[styles.title, { color: colors.title }]}>Stop Scout</Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]}>
        Zaloguj się lub utwórz konto
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.title,
          },
        ]}
        placeholderTextColor={colors.subtext}
        placeholder="Nazwa użytkownika (login)"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.title,
          },
        ]}
        placeholderTextColor={colors.subtext}
        placeholder="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Ładowanie..." : "Zaloguj się"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.registerButton]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Zarejestruj się</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/(tabs)")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: colors.subtext, textAlign: "center" }}>
          Pomiń (Przejdź do aplikacji)
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  registerButton: {
    backgroundColor: "#10B981",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
