import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const RafListesiScreen = () => {
  const route = useRoute();
  const { envanter } = route.params;
  

  console.log("Gelen envanter:", envanter); // ← burası
  console.log("RAFLAR:", envanter.raflar);

  const handleUrunEkle = async (rafKod, miktar) => {
    try {
      const response = await axios.put(`http://10.33.10.55:5001/urun-ekle`, {
        envanterId: envanter._id,
        rafKod,
        miktar
      });

      Alert.alert("Başarılı", response.data.message);
    } catch (err) {
      Alert.alert("Hata", err.response?.data?.error || "Bir hata oluştu.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗂 Raf Listesi: {envanter.ad}</Text>

      <FlatList
        data={envanter.raflar}
        keyExtractor={(item) => item.kod}
        renderItem={({ item }) => (
          <View style={styles.rafCard}>
            <Text style={styles.text}>📌 Kod: {item.kod}</Text>
            <Text style={styles.text}>🔢 Kapasite: {item.kapasite}</Text>
            <Text style={styles.text}>📦 Kalan: {item.kalan}</Text>
            <Button
                    title="Detaya Git"
                    onPress={() => navigation.navigate("RafDetay", {
                        envanterId: envanter._id,
                        raf: item
                    })}
                    />

            <Button title="+10 Ürün Ekle" onPress={() => handleUrunEkle(item.kod, 10)} />
          </View>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  rafCard: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  text: { fontSize: 16, marginBottom: 4 },
});

export default RafListesiScreen;


