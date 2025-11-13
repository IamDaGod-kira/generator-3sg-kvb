import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from "react-native";
import { initializeApp } from "firebase/app";
// firebase.js
import { 
  getFirestore, 
  initializeFirestore ,
  doc,getDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  VITE_APIKEY,
  VITE_APPID,
  VITE_AUTHDOMAIN,
  VITE_MEASUREMENTID,
  VITE_MESSAGINGSENDERID,
  VITE_PROJECTID,
  VITE_STORAGEBUCKET
} from "@env";

// --- Optional sanity check ---
if (
  !VITE_APIKEY ||
  !VITE_APPID ||
  !VITE_AUTHDOMAIN ||
  !VITE_PROJECTID ||
  !VITE_STORAGEBUCKET
) {
  console.warn(
    "⚠️ Missing one or more Firebase environment variables. Check your .env file and babel.config.js setup."
  );
}

const firebaseConfig = {
  apiKey: VITE_APIKEY,
  authDomain: VITE_AUTHDOMAIN,
  projectId: VITE_PROJECTID,
  storageBucket: VITE_STORAGEBUCKET,
  messagingSenderId: VITE_MESSAGINGSENDERID,
  appId: VITE_APPID,
  measurementId: VITE_MEASUREMENTID,
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);

// --- Fix: Firestore mobile long-polling mode for RN ---
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// --- Auth and Storage ---
const auth = getAuth(app);
const storage = getStorage(app);
// --- MAIN APP ---
export default function App() {
  const [name, setName] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [schedule, setSchedule] = useState([]);

  const fetchSchedule = async () => {
    if (!uniqueId || uniqueId.length < 4) {
      Alert.alert("Invalid ID", "Unique ID must be at least 4 characters long.");
      return;
    }

    const docId = uniqueId.slice(-4); // use last 4 digits
    const docRef = doc(db, "students", docId);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.schedule && Array.isArray(data.schedule)) {
          setSchedule(data.schedule);
        } else {
          Alert.alert("No Schedule", "No valid schedule found for this ID.");
        }
      } else {
        Alert.alert("Not Found", `No record found for ID ending with ${docId}.`);
      }
    } catch (error) {
      console.error("Firestore fetch error:", error);
      Alert.alert("Error", "Failed to fetch from Firestore. Check internet or config.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎓 Student Schedule Fetcher</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Student Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Unique ID"
        value={uniqueId}
        onChangeText={setUniqueId}
        keyboardType="numeric"
      />

      <Button title="Fetch Schedule" onPress={fetchSchedule} />

      {schedule.length > 0 && (
        <>
          <Text style={styles.subtitle}>Schedule for {name}:</Text>
          <FlatList
            data={schedule}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <Text style={styles.item}>{index + 1}. {item}</Text>
            )}
          />
        </>
      )}
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f7f8fa",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  subtitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  item: {
    fontSize: 16,
    paddingVertical: 6,
    color: "#444",
  },
});
