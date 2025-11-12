import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import SavedScheduleScreen from './screens/SavedScheduleScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Scan QR" component={ScannerScreen} />
          <Stack.Screen name="Saved Schedule" component={SavedScheduleScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
