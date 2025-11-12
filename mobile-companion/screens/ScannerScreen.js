import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, doc, getDoc } from '../firebaseConfig';

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) return <Text>Requesting permission...</Text>;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No camera access.</Text>
        <Button onPress={requestPermission}>Grant Permission</Button>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    try {
      const payload = JSON.parse(data);

      if (payload.type !== 'student_ref' || !payload.uid) {
        Alert.alert('Invalid QR', 'This QR code is not a valid 3SG reference.');
        return;
      }

      const ref = doc(db, 'students', payload.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const studentData = snap.data();
        const schedule = studentData.schedule || [];

        const saved = await AsyncStorage.getItem('savedSchedules');
        const arr = saved ? JSON.parse(saved) : [];

        arr.push({
          name: studentData.fullname || payload.name,
          class: studentData.class || 'N/A',
          schedule,
          timestamp: new Date().toLocaleString(),
        });

        await AsyncStorage.setItem('savedSchedules', JSON.stringify(arr));

        Alert.alert('Success', 'Schedule saved locally!');
      } else {
        Alert.alert('Not Found', 'No student found for this reference.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Invalid QR or database error.');
    } finally {
      setTimeout(() => setScanned(false), 2000);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
      <View style={styles.bottom}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Saved Schedule')}
        >
          View Saved Schedules
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bottom: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
