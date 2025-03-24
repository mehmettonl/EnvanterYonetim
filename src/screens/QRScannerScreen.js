import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const QRScannerScreen = () => {
  const [isScanned, setIsScanned] = useState(false);
  const navigation = useNavigation();

  const handleBarCodeRead = async ({ data }) => {
    if (isScanned) return;

    setIsScanned(true); // Tek seferlik tarama

    try {
      const parsed = JSON.parse(data); // QR içinde JSON varsa
      const id = parsed._id;

      if (!id) throw new Error("Geçersiz QR");

      const res = await axios.get(`http://192.168.1.202:5001/envanterler`);
      const match = res.data.find(e => e._id === id);

      if (match) {
        navigation.navigate('EditEnvanter', match);
      } else {
        Alert.alert("Bulunamadı", "Bu ID'ye ait envanter yok.");
      }

    } catch (err) {
      Alert.alert("Hata", "QR kod okunamadı veya geçersiz.");
    }

    // Tekrar tarama için bekletip sıfırla (opsiyonel)
    setTimeout(() => setIsScanned(false), 3000);
  };

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