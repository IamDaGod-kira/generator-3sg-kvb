import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card, Text } from 'react-native-paper';

export default function SavedDataScreen() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const stored = await AsyncStorage.getItem('scannedData');
    if (stored) setData(JSON.parse(stored));
    else setData([]);
  };

  const clearData = async () => {
    await AsyncStorage.removeItem('scannedData');
    setData([]);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={loadData} style={styles.button}>
        Refresh
      </Button>
      <Button mode="outlined" onPress={clearData} style={styles.button}>
        Clear All
      </Button>
      <ScrollView>
        {data.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No saved data.
          </Text>
        ) : (
          data.map((item, i) => (
            <Card key={i} style={styles.card}>
              <Card.Title title={`Entry #${i + 1}`} />
              <Card.Content>
                <Text>{JSON.stringify(item, null, 2)}</Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  button: { marginVertical: 5 },
  card: { marginVertical: 6 },
});
