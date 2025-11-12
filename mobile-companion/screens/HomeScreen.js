import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Title } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>3SG Companion App</Title>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Scan QR')}
        style={styles.button}
      >
        Scan QR Code
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Saved Schedule')}
        style={styles.button}
      >
        View Saved Schedule
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { marginBottom: 40, fontSize: 24 },
  button: { marginVertical: 10, width: 220 },
});
