import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://operator-lying-deranged.ngrok-free.dev";

export default function SchemesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [schemes, setSchemes] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [producerProfile, setProducerProfile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (params.schemesData) {
      try {
        const data = JSON.parse(params.schemesData);
        setSchemes(data.matched_schemes || []);
        setPlatforms(data.recommended_platforms || []);
      } catch { setSchemes([]); }
    }
    loadProducerProfile();
  }, []);

  const loadProducerProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem("producerProfile");
      if (stored) setProducerProfile(JSON.parse(stored));
    } catch {}
  };

  const generateListing = async () => {
    setIsGenerating(true);
    try {
      const body = {
        craft: producerProfile?.craft || "",
        description: `Traditional ${producerProfile?.craft || "handicraft"} from ${producerProfile?.location || "Tamil Nadu"}`,
        price: 0,
        location: producerProfile?.location || "",
        language: producerProfile?.language || "Tamil",
      };

      const response = await fetch(`${API_BASE_URL}/api/generate-listing/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        alert("Could not generate listing. Try again.");
        setIsGenerating(false);
        return;
      }

      router.push({ pathname: "/listing", params: { listingData: JSON.stringify(data), language: producerProfile?.language || "Tamil" } });
    } catch {
      alert("Connection error. Make sure Django and ngrok are running.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>உங்களுக்கான திட்டங்கள்</Text>
      <Text style={styles.subtitle}>{schemes.length} schemes matched for you</Text>

      {schemes.map((scheme, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.schemeNumber}>{index + 1}</Text>
            <Text style={styles.schemeName}>{scheme.name}</Text>
          </View>
          <Text style={styles.sectionLabel}>💰 Benefit</Text>
          <Text style={styles.sectionText}>{scheme.benefit}</Text>
          {scheme.how_to_apply && (
            <>
              <Text style={styles.sectionLabel}>📋 How to Apply</Text>
              <Text style={styles.sectionText}>{scheme.how_to_apply}</Text>
            </>
          )}
        </View>
      ))}

      {platforms.length > 0 && (
        <View style={styles.platformsCard}>
          <Text style={styles.platformsTitle}>🛒 Recommended Platforms</Text>
          {platforms.map((p, i) => <Text key={i} style={styles.platformItem}>• {p}</Text>)}
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, isGenerating && styles.buttonDisabled]}
        onPress={generateListing}
        disabled={isGenerating}
      >
        {isGenerating ? <ActivityIndicator color="#fff" /> : (
          <Text style={styles.buttonText}>உங்கள் தயாரிப்பை பட்டியலிடு →</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.buttonSubtext}>Generate your product listing</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  content: { padding: 20, paddingTop: 56, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "700", color: "#B85C38", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 24 },
  card: {
    backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 16,
    borderLeftWidth: 4, borderLeftColor: "#B85C38",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12, gap: 10 },
  schemeNumber: {
    backgroundColor: "#B85C38", color: "#fff", width: 26, height: 26,
    borderRadius: 13, textAlign: "center", lineHeight: 26,
    fontSize: 13, fontWeight: "700", flexShrink: 0,
  },
  schemeName: { fontSize: 15, fontWeight: "700", color: "#222", flex: 1, lineHeight: 22 },
  sectionLabel: { fontSize: 12, fontWeight: "600", color: "#B85C38", marginTop: 8, marginBottom: 4 },
  sectionText: { fontSize: 14, color: "#444", lineHeight: 21 },
  platformsCard: { backgroundColor: "#FDE8D8", borderRadius: 14, padding: 16, marginBottom: 24 },
  platformsTitle: { fontSize: 15, fontWeight: "700", color: "#B85C38", marginBottom: 10 },
  platformItem: { fontSize: 14, color: "#555", marginBottom: 4 },
  button: {
    backgroundColor: "#B85C38", borderRadius: 12,
    paddingVertical: 16, alignItems: "center", marginBottom: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  buttonSubtext: { textAlign: "center", color: "#888", fontSize: 12, marginBottom: 20 },
  backButton: { alignItems: "center", padding: 12 },
  backText: { color: "#B85C38", fontSize: 15 },
});