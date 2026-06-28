// Vazhi — Home Screen (Mic Button)
//
// WHERE TO PUT THIS FILE:
//   Vazhi/mobile/app/home.js
//
// WHAT THIS SCREEN DOES:
//   Shows a big mic button. Tap once to start recording, tap again to stop.
//   After stopping, uploads the audio file to Django: POST /api/transcribe/
//   (field name "audio_file", matching ai_engine/views.py exactly)
//   On success, navigates to /transcription with the returned transcript
//   passed as a route parameter.
//
// IMPORTANT — before running:
//   1. Replace API_BASE_URL below with your current ngrok forwarding URL
//      (it changes every time you restart ngrok — check your ngrok terminal tab)
//   2. This screen needs microphone permission, which Expo will prompt for
//      automatically the first time you tap the mic button.

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";

// 👉 REPLACE THIS with your current ngrok forwarding URL (no trailing slash)
const API_BASE_URL = "https://operator-lying-deranged.ngrok-free.dev";

export default function HomeScreen() {
  const router = useRouter();
  const recordingRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Microphone permission needed",
          "Please allow microphone access to record your voice."
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);
    } catch (error) {
      Alert.alert("Recording error", "Could not start recording. Please try again.");
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);

      if (!recordingRef.current) return;

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      if (uri) {
        await uploadAudio(uri);
      }
    } catch (error) {
      Alert.alert("Recording error", "Could not stop recording properly.");
    }
  };

  const uploadAudio = async (uri) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("audio_file", {
        uri: uri,
        name: "recording.m4a",
        type: "audio/m4a",
      });

      const response = await fetch(`${API_BASE_URL}/api/transcribe/`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Transcription failed", data.error || "Something went wrong.");
        setIsUploading(false);
        return;
      }

      // Navigate to transcription screen with the result.
      // We pass the whole response as a JSON string param; the next screen will parse it.
      router.push({
        pathname: "/transcription",
        params: { transcriptData: JSON.stringify(data) },
      });
    } catch (error) {
      Alert.alert(
        "Connection error",
        "Could not reach the server. Make sure Django and ngrok are running."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleMicPress = () => {
    if (isUploading) return; // ignore taps while uploading
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>வழி</Text>
      <Text style={styles.subtitle}>
        {isUploading
          ? "Processing your voice..."
          : isRecording
          ? "Listening... tap to stop"
          : "Tap the mic and speak in Tamil"}
      </Text>

      <TouchableOpacity
        style={[
          styles.micButton,
          isRecording && styles.micButtonRecording,
          isUploading && styles.micButtonDisabled,
        ]}
        onPress={handleMicPress}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <Text style={styles.micIcon}>{isRecording ? "■" : "🎙"}</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.hint}>
        {isRecording
          ? "Tap the square to stop recording"
          : "Tell us about your craft, your needs, or anything you'd like help with"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#B85C38",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 48,
    textAlign: "center",
  },
  micButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#B85C38",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#B85C38",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  micButtonRecording: {
    backgroundColor: "#D9483A",
  },
  micButtonDisabled: {
    opacity: 0.7,
  },
  micIcon: {
    fontSize: 56,
  },
  hint: {
    marginTop: 40,
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});