import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    try {
      const parsed = JSON.parse(data);
      await AsyncStorage.setItem("scheduleData", JSON.stringify(parsed));
      Alert.alert("Saved", "Schedule stored successfully!");
    } catch {
      Alert.alert("Error", "Invalid QR code data.");
    }
    setScanning(false);
  };

  const loadSchedule = async () => {
    const stored = await AsyncStorage.getItem("scheduleData");
    if (!stored) {
      Alert.alert("No Data", "No saved schedule found.");
      return;
    }
    setSchedule(JSON.parse(stored));
  };

  if (hasPermission === null)
    return (
      <Text style={{ textAlign: "center", marginTop: 50 }}>
        Requesting permission...
      </Text>
    );
  if (hasPermission === false)
    return (
      <Text style={{ textAlign: "center", marginTop: 50 }}>
        Camera permission denied.
      </Text>
    );

  return (
    <View style={styles.container}>
      {scanning ? (
        <Camera
          style={styles.camera}
          type="back"
          onBarCodeScanned={handleBarCodeScanned}
          barCodeScannerSettings={{ barCodeTypes: ["qr"] }}
        />
      ) : (
        <>
          <Text style={styles.title}>3SG Schedule Scanner</Text>
          <View style={styles.button}>
            <Button
              title="Scan Code"
              color="#4CAF50"
              onPress={() => setScanning(true)}
            />
          </View>
          <View style={styles.button}>
            <Button
              title="See Saved Schedule"
              color="#3498DB"
              onPress={loadSchedule}
            />
          </View>
          {schedule && (
            <ScrollView style={styles.table}>
              {Object.keys(schedule).map((key) => {
                const week = schedule[key];
                return (
                  <View key={key} style={styles.week}>
                    <Text style={styles.weekTitle}>
                      Week {week.week_number}
                    </Text>
                    {Object.entries(week.subjects).map(([subject, topic]) => (
                      <Text key={subject} style={styles.row}>
                        <Text style={styles.subject}>{subject}: </Text>
                        {topic}
                      </Text>
                    ))}
                  </View>
                );
              })}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FA",
  },
  camera: { flex: 1, width: "100%" },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 30,
  },
  button: { marginVertical: 10, width: "80%" },
  table: { marginTop: 30, width: "100%", padding: 10 },
  week: {
    backgroundColor: "#ECF0F1",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  weekTitle: { fontWeight: "700", color: "#34495E", marginBottom: 5 },
  row: { color: "#2C3E50" },
  subject: { fontWeight: "600" },
});
