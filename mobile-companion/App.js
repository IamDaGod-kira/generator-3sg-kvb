import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import SavedDataScreen from './screens/SavedDataScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Scan QR" component={ScannerScreen} />
          <Stack.Screen name="Saved Data" component={SavedDataScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
