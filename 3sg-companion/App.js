import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Provider as PaperProvider, TextInput, Button, Text, Card, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function App() {
  const [name, setName] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [schedule, setSchedule] = useState(null);
  const [savedSchedules, setSavedSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState('home');

  // Load saved schedules
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('schedules');
      if (saved) setSavedSchedules(JSON.parse(saved));
    })();
  }, []);

  const fetchSchedule = async () => {
    if (!name || !uniqueId) {
      alert('Enter both name and Unique ID');
      return;
    }

    const shortId = uniqueId.trim().slice(-4);
    setLoading(true);

    try {
      const ref = doc(collection(db, 'students'), shortId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        if (data.schedule) {
          setSchedule(data.schedule);
          await AsyncStorage.setItem('lastSchedule', JSON.stringify(data.schedule));
          alert('Schedule fetched successfully.');
        } else {
          alert('No schedule found for this student.');
        }
      } else {
        alert('No student found for this Unique ID.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching schedule. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const saveSchedule = async () => {
    if (!schedule) {
      alert('No schedule to save!');
      return;
    }

    const newSaved = [...savedSchedules, { name, uniqueId, schedule }];
    setSavedSchedules(newSaved);
    await AsyncStorage.setItem('schedules', JSON.stringify(newSaved));
    alert('Schedule saved locally.');
  };

  const renderSchedule = (data) => {
    if (!data) return <Text style={{ textAlign: 'center', marginTop: 20 }}>No schedule loaded.</Text>;

    return (
      <FlatList
        data={data}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item: s, index: i }) => {
          let displayText = '';

          if (typeof s === 'string') displayText = s;
          else if (Array.isArray(s)) displayText = s.join(', ');
          else if (typeof s === 'object' && s !== null)
            displayText = Object.entries(s)
              .map(([k, v]) => `${k}: ${v}`)
              .join(' • ');
          else displayText = JSON.stringify(s);

          return (
            <Card style={styles.card}>
              <Card.Content>
                <Title>Week {i + 1}</Title>
                <Text>{displayText}</Text>
              </Card.Content>
            </Card>
          );
        }}
      />
    );
  };

  if (page === 'saved') {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Title style={{ textAlign: 'center', marginBottom: 10 }}>📚 Saved Schedules</Title>
          {savedSchedules.length === 0 ? (
            <Text style={{ textAlign: 'center' }}>No saved schedules yet.</Text>
          ) : (
            <FlatList
              data={savedSchedules}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <Card style={styles.card}>
                  <Card.Content>
                    <Title>{item.name} ({item.uniqueId})</Title>
                    {renderSchedule(item.schedule)}
                  </Card.Content>
                </Card>
              )}
            />
          )}
          <Button mode="contained" onPress={() => setPage('home')} style={{ marginTop: 20 }}>
            ← Back
          </Button>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Title style={{ textAlign: 'center', marginBottom: 20 }}>🎓 Smart Schedule Companion</Title>
        <TextInput label="Student Name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput label="Unique ID" value={uniqueId} onChangeText={setUniqueId} style={styles.input} />
        <Button mode="contained" onPress={fetchSchedule} loading={loading} style={styles.button}>
          Fetch Schedule
        </Button>

        <Button mode="contained-tonal" onPress={saveSchedule} style={styles.button}>
          Save Schedule
        </Button>

        <Button mode="outlined" onPress={() => setPage('saved')} style={styles.button}>
          View Saved Schedules
        </Button>

        <View style={{ flex: 1, width: '100%', marginTop: 20 }}>
          {renderSchedule(schedule)}
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    padding: 20,
    paddingTop: 50,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginVertical: 6,
  },
  card: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
});
