import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://operator-lying-deranged.ngrok-free.dev";

export default function TranscriptionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [producerProfile, setProducerProfile] = useState(null);

  useEffect(() => {
    if (params.transcriptData) {
      try {
        const data = JSON.parse(params.transcriptData);
        setTranscript(data.transcript || "");
      } catch { setTranscript(""); }
    }
    loadProducerProfile();
  }, []);

  const loadProducerProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem("producerProfile");
      if (stored) setProducerProfile(JSON.parse(stored));
    } catch {}
  };

  const findSchemes = async () => {
    if (!transcript.trim()) {
      Alert.alert("Nothing to search", "Please record your voice first.");
      return;
    }
    setIsLoading(true);
    try {
      const body = {
        transcript,
        craft: producerProfile?.craft || "",
        location: producerProfile?.location || "",
        monthly_income: producerProfile?.monthly_income || 0,
        caste_category: producerProfile?.caste_category || "General",
        language: producerProfile?.language || "Tamil",
      };

      const response = await fetch(`${API_BASE_URL}/api/match-schemes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Error", data.error || "Could not find schemes.");
        setIsLoading(false);
        return;
      }

      router.push({ pathname: "/schemes", params: { schemesData: JSON.stringify(data) } });
    } catch {
      Alert.alert("Connection error", "Could not reach the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>நீங்கள் சொன்னது</Text>
      <Text style={styles.subtitle}>This is what we heard. Edit if needed.</Text>

      <View style={styles.transcriptBox}>
        <TextInput
          style={styles.transcriptInput}
          value={transcript}
          onChangeText={setTranscript}
          multiline
          placeholder="Your speech will appear here..."
          placeholderTextColor="#aaa"
        />
      </View>

      {producerProfile && (
        <View style={styles.profileBadge}>
          <Text style={styles.profileText}>
            🧑‍🎨 {producerProfile.name} · {producerProfile.craft} · {producerProfile.location} · {producerProfile.language}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={findSchemes}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#fff" /> : (
          <Text style={styles.buttonText}>திட்டங்களை கண்டுபிடி →</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.buttonSubtext}>Find matching government schemes</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Record again</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "700", color: "#B85C38", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 24 },
  transcriptBox: {
    backgroundColor: "#fff", borderRadius: 12, borderWidth: 1,
    borderColor: "#E8D5C4", padding: 16, minHeight: 140, marginBottom: 20,
  },
  transcriptInput: { fontSize: 18, color: "#333", lineHeight: 28 },
  profileBadge: { backgroundColor: "#FDE8D8", borderRadius: 8, padding: 10, marginBottom: 24 },
  profileText: { fontSize: 13, color: "#B85C38" },
  button: {
    backgroundColor: "#B85C38", borderRadius: 12,
    paddingVertical: 16, alignItems: "center", marginBottom: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  buttonSubtext: { textAlign: "center", color: "#888", fontSize: 12, marginBottom: 32 },
  backButton: { alignItems: "center", padding: 12 },
  backText: { color: "#B85C38", fontSize: 15 },
});