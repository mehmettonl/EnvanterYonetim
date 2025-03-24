import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRoute } from '@react-navigation/native';

const QRCodeScreen = () => {
  const route = useRoute();
  const { envanter } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 QR Kodu</Text>
      <QRCode value={JSON.stringify(envanter)} size={250} />
      <Text style={styles.label}>Envanter: {envanter.ad}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default QRCodeScreen;