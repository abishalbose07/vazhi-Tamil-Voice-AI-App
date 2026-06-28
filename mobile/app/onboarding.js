import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://operator-lying-deranged.ngrok-free.dev";

const CASTE_OPTIONS = [
  { label: "SC", value: "SC" },
  { label: "ST", value: "ST" },
  { label: "OBC", value: "OBC" },
  { label: "BC", value: "BC" },
  { label: "General", value: "General" },
];

const LANGUAGE_OPTIONS = [
  { label: "தமிழ்", value: "Tamil" },
  { label: "English", value: "English" },
  { label: "తెలుగు", value: "Telugu" },
  { label: "ಕನ್ನಡ", value: "Kannada" },
  { label: "हिंदी", value: "Hindi" },
];

export default function OnboardingScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [craft, setCraft] = useState("");
  const [location, setLocation] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [phone, setPhone] = useState("");
  const [casteCategory, setCasteCategory] = useState("General");
  const [language, setLanguage] = useState("Tamil");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !craft.trim() || !location.trim() || !phone.trim()) {
      Alert.alert("Missing details", "Please fill in name, craft, location, and phone number.");
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length < 10) {
      Alert.alert("Invalid phone number", "Phone number must have at least 10 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/producers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          craft: craft.trim(),
          location: location.trim(),
          monthly_income: monthlyIncome.trim() ? parseInt(monthlyIncome.trim(), 10) : null,
          phone: cleanedPhone,
          caste_category: casteCategory,
          language: language.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const firstError = Object.values(data)[0];
        const message = Array.isArray(firstError) ? firstError[0] : JSON.stringify(data);
        Alert.alert("Could not save profile", message);
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem("producerProfile", JSON.stringify({
        name: name.trim(),
        craft: craft.trim(),
        location: location.trim(),
        monthly_income: monthlyIncome.trim() ? parseInt(monthlyIncome.trim(), 10) : null,
        caste_category: casteCategory,
        language: language,
      }));

      router.replace("/home");
    } catch (error) {
      Alert.alert("Connection error", "Could not reach the server. Make sure Django and ngrok are running.");
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>வழி</Text>
        <Text style={styles.subtitle}>Tell us about yourself</Text>

        <Text style={styles.label}>Choose your language / மொழியை தேர்ந்தெடுக்கவும்</Text>
        <View style={styles.chipRow}>
          {LANGUAGE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, language === opt.value && styles.chipSelected]}
              onPress={() => setLanguage(opt.value)}
            >
              <Text style={[styles.chipText, language === opt.value && styles.chipTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Lakshmi"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Your Craft</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Tanjore Plate Making"
          placeholderTextColor="#999"
          value={craft}
          onChangeText={setCraft}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Thanjavur"
          placeholderTextColor="#999"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Monthly Income (₹) — optional</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 8000"
          placeholderTextColor="#999"
          value={monthlyIncome}
          onChangeText={setMonthlyIncome}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 9876543210"
          placeholderTextColor="#999"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.chipRow}>
          {CASTE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[styles.chip, casteCategory === option.value && styles.chipSelected]}
              onPress={() => setCasteCategory(option.value)}
            >
              <Text style={[styles.chipText, casteCategory === option.value && styles.chipTextSelected]}>
                {option.value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 40, fontWeight: "700", color: "#B85C38", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 32 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6, marginTop: 16 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5DCD0",
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5DCD0",
    backgroundColor: "#fff",
  },
  chipSelected: { backgroundColor: "#B85C38", borderColor: "#B85C38" },
  chipText: { fontSize: 14, color: "#333" },
  chipTextSelected: { color: "#fff", fontWeight: "600" },
  button: {
    backgroundColor: "#B85C38",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 32,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});