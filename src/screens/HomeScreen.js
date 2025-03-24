import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
      <Text style={styles.title}>Envanter Yönetim Sistemi</Text>
      <Button
        title="Envanterlere Git"
        onPress={() => navigation.navigate('EnvanterScreen')} 
      />
      <Button
        title="Envanterler Ekle"
        onPress={() => navigation.navigate('AddEnvanter')} 
      />  
  
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
})