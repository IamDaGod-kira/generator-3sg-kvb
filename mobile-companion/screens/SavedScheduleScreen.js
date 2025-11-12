import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card, Text, Divider } from 'react-native-paper';

export default function SavedScheduleScreen() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const stored = await AsyncStorage.getItem('savedSchedules');
    if (stored) setData(JSON.parse(stored));
    else setData([]);
  };

  const clearData = async () => {
    await AsyncStorage.removeItem('savedSchedules');
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
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No saved schedules.</Text>
        ) : (
          data.map((item, i) => (
            <Card key={i} style={styles.card}>
              <Card.Title title={`${item.name} (${item.class})`} subtitle={item.timestamp} />
              <Card.Content>
                {item.schedule.length === 0 ? (
                  <Text>No schedule data.</Text>
                ) : (
                  Object.entries(item.schedule).map(([subject, topic], j) => (
                    <View key={j} style={styles.row}>
                      <Text style={styles.subject}>{subject}</Text>
                      <Text style={styles.topic}>{topic}</Text>
                    </View>
                  ))
                )}
              </Card.Content>
              <Divider style={{ marginTop: 10 }} />
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
  card: { marginVertical: 6, padding: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  subject: { fontWeight: 'bold', flex: 1 },
  topic: { flex: 2, textAlign: 'right' },
});
