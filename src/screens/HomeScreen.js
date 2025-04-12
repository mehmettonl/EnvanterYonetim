import { StyleSheet, Text, View, Button, Image } from 'react-native';
import React from 'react';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Başlık */}
      <Text style={styles.title}>📦 Envanter Yönetim Sistemi</Text>

      {/* Karşılama mesajı */}
      <Text style={styles.subtitle}>Hoş geldiniz! Aşağıdan işlemlerinizi seçebilirsiniz.</Text>

      {/* Butonlar */}
      <View style={styles.buttonContainer}>
        <Button
          title="Envanterlere Git"
          onPress={() => navigation.navigate('EnvanterScreen')}
          color="#1e90ff"
        />
        <View style={{ height: 10 }} />
        <Button
          title="Envanter Ekle"
          onPress={() => navigation.navigate('AddEnvanter')}
          color="#28a745"
        />
      </View>

      {/* Görsel */}
      <Image
        source={require('../../assets/ss.png')}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 30,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginTop: 20,
  },
});
