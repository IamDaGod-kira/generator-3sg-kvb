import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Text } from 'react-native-paper';

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No camera access.</Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    try {
      const jsonData = JSON.parse(data);
      const existing = await AsyncStorage.getItem('scannedData');
      const arr = existing ? JSON.parse(existing) : [];
      arr.push(jsonData);
      await AsyncStorage.setItem('scannedData', JSON.stringify(arr));
      Alert.alert('Success', 'JSON saved locally.');
    } catch (e) {
      Alert.alert('Invalid', 'QR data is not valid JSON.');
    }
    setTimeout(() => setScanned(false), 2000);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      <View style={styles.bottom}>
        <Button mode="contained" onPress={() => navigation.navigate('Saved Data')}>
          View Saved Data
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bottom: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
