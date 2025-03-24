import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import EnvanterScreen from './src/screens/EnvanterScreen';
import AddEnvanter from './src/screens/AddEnvanter';
import EditEnvanterScreen from './src/screens/EditEnvanterScreen';
import QRCodeScreen from './src/screens/QRCodeScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="EnvanterScreen" component={EnvanterScreen} />
        <Stack.Screen name="AddEnvanter" component={AddEnvanter} 
                options={{ title: "Envanter Ekle" }} // Başlık burada değiştirildi
/>
        <Stack.Screen name="QRCodeScreen" component={QRCodeScreen} options={{ title: 'QR Kod' }} />
        <Stack.Screen name="EditEnvanter" component={EditEnvanterScreen} 
        options={{title:"Envanterleri Güncelle"}}/>
        <Stack.Screen name="QRScannerScreen" component={QRScannerScreen} options={{ title: 'QR Oku' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({


});


  