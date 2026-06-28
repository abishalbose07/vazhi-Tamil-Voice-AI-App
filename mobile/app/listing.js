import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Clipboard, Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ListingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [listing, setListing] = useState("");
  const [language, setLanguage] = useState("Tamil");

  useEffect(() => {
    if (params.listingData) {
      try {
        const data = JSON.parse(params.listingData);
        setListing(data.listing || "");
      } catch { setListing(""); }
    }
    if (params.language) setLanguage(params.language);
  }, []);

  const copyToClipboard = () => {
    Clipboard.setString(listing);
    Alert.alert("Copied!", "Listing copied to clipboard.");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>உங்கள் பட்டியல் தயார்!</Text>
      <Text style={styles.subtitle}>Your listing is ready · Language: {language}</Text>

      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>📝 {language} Listing</Text>
          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Text style={styles.copyButtonText}>Copy</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.listingText}>{listing}</Text>
      </View>

      <View style={styles.hintCard}>
        <Text style={styles.hintTitle}>📲 Where to share</Text>
        <Text style={styles.hintText}>
          Copy your listing and paste it on WhatsApp, Meesho, Amazon Karigar,
          Flipkart Samarth, or any selling platform.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/home")}>
        <Text style={styles.buttonText}>🎙 Record Another Product</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back to Schemes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  content: { padding: 20, paddingTop: 56, paddingBottom: 48 },
  title: { fontSize: 26, fontWeight: "700", color: "#B85C38", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 24 },
  card: {
    backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  cardTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#B85C38" },
  copyButton: { backgroundColor: "#B85C38", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  copyButtonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  listingText: { fontSize: 15, color: "#333", lineHeight: 24 },
  hintCard: { backgroundColor: "#FDE8D8", borderRadius: 14, padding: 16, marginBottom: 24 },
  hintTitle: { fontSize: 15, fontWeight: "700", color: "#B85C38", marginBottom: 6 },
  hintText: { fontSize: 14, color: "#555", lineHeight: 21 },
  button: {
    backgroundColor: "#B85C38", borderRadius: 12,
    paddingVertical: 16, alignItems: "center", marginBottom: 12,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  backButton: { alignItems: "center", padding: 12 },
  backText: { color: "#B85C38", fontSize: 15 },
});