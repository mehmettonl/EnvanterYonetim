import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

let RNCamera;
if (Platform.OS !== 'web') {
  RNCamera = require('react-native-camera').RNCamera;
}

const QRScannerScreen = () => {
  const [isScanned, setIsScanned] = useState(false);
  const navigation = useNavigation();

  const handleBarCodeRead = async ({ data }) => {
    if (isScanned) return;

    setIsScanned(true);

    try {
      const parsed = JSON.parse(data);
      const id = parsed._id;

      if (!id) throw new Error("Geçersiz QR");

      const res = await fetch(`http://localhost:5001/envanterler`);
      const allData = await res.json();
      const match = allData.find(e => e._id === id);

      if (match) {
        navigation.navigate('EditEnvanter', match);
      } else {
        Alert.alert("Bulunamadı", "Bu ID'ye ait envanter yok.");
      }
    } catch (err) {
      Alert.alert("Hata", "QR kod okunamadı veya geçersiz.");
    }

    setTimeout(() => setIsScanned(false), 3000);
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 18 }}>📷 QR Tarama şu anda web'de desteklenmiyor.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        onBarCodeRead={handleBarCodeRead}
        captureAudio={false}
      >
        <View style={styles.overlay}>
          <Text style={styles.text}>QR Kodunu Tara</Text>
        </View>
      </RNCamera>
    </View>
  );
};

export default QRScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});