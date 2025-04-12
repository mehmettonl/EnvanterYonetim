import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const RafDetayScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { envanterId, raf } = route.params;

  const [miktar, setMiktar] = useState("");

  const handleEkle = async () => {
    const sayi = parseInt(miktar, 10);
    if (isNaN(sayi) || sayi <= 0) {
      Alert.alert("Geçersiz Giriş", "Lütfen geçerli bir miktar girin.");
      return;
    }

    try {
      const response = await axios.put('http://10.33.10.55:5001/urun-ekle', {
        envanterId,
        rafKod: raf.kod,
        miktar: sayi
      });
      Alert.alert("Başarılı", response.data.message);
      navigation.goBack(); // Geri dön
    } catch (error) {
      Alert.alert("Hata", error.response?.data?.error || "Bir hata oluştu");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧾 Raf Detayı</Text>
      <Text style={styles.label}>📌 Kod: {raf.kod}</Text>
      <Text style={styles.label}>🔢 Kapasite: {raf.kapasite}</Text>
      <Text style={styles.label}>📦 Kalan: {raf.kalan}</Text>

      <TextInput
        placeholder="Eklenecek ürün miktarı"
        value={miktar}
        onChangeText={setMiktar}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Ürün Ekle" onPress={handleEkle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 18, marginBottom: 8 },
  input: {
    width: '80%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  }
});

export default RafDetayScreen;