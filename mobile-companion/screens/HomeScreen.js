import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Title } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>QR JSON Scanner</Title>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Scan QR')}
        style={styles.button}
      >
        Scan QR Code
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Saved Data')}
        style={styles.button}
      >
        View Saved Data
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { marginBottom: 40, fontSize: 24 },
  button: { marginVertical: 10, width: 200 },
});
