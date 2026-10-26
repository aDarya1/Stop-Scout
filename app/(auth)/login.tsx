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
import { container } from "../../src/di/container";
import { useStore } from "../../src/store/useStore";

export default function LoginScreen() {
  const router = useRouter();
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
      login(user.username);
      Alert.alert("Sukces", "Konto zostało utworzone!");
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Błąd rejestracji", error.message);
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
      login(user.username);
      Alert.alert("Sukces", "Zalogowano pomyślnie!");
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Błąd logowania", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stop Scout</Text>
      <Text style={styles.subtitle}>Zaloguj się lub utwórz konto</Text>

      <TextInput
        style={styles.input}
        placeholder="Nazwa użytkownika (login)"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
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
        <Text style={{ color: "#6B7280", textAlign: "center" }}>
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
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
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
