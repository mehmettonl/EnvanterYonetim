import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const EnvanterScreen = () => {
  const [envanterler, setEnvanterler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get("http://10.33.10.55:5001/envanterler")
      .then((response) => {
        setEnvanterler(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Envanterler alınırken bir hata oluştu.');
        setLoading(false);
      });
  }, []);

  const handleSil = (id) => {
    Alert.alert(
      "Emin misin?",
      "Bu envanteri silmek istediğine emin misin?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet, sil",
          style: "destructive",
          onPress: () => {
            axios
              .delete(`http://10.33.10.55:5001/envanter-sil/${id}`)
              .then(() => {
                setEnvanterler((prev) => prev.filter((item) => item._id !== id));
              })
              .catch((error) => {
                Alert.alert("Hata", "Silme işlemi sırasında bir hata oluştu.");
              });
          },
        },
      ]
    );
  };

  if (loading) return <Text>Yükleniyor...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Envanter Listesi</Text>
      <FlatList
        data={envanterler}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>📌 Ad: {item.ad}</Text>
            <Text style={styles.itemText}>🔢 Numara: {item.numara}</Text>
            <Text style={styles.itemText}>📦 Toplam Raf: {item.toplamRaf}</Text>

            <Button
              title="Düzenle"
              onPress={() => navigation.navigate("EditEnvanter", { envanter: item })}
            />

            <Button
              title="Rafları Gör"
              onPress={async () => {
                try {
                  const res = await axios.get(`http://10.33.10.55:5001/envanter/${item._id}`);
                  navigation.navigate('RafListesi', { envanter: res.data });
                } catch (error) {
                  Alert.alert("Hata", "Detaylı envanter bilgisi alınamadı.");
                }
              }}
            />

            <Button
              title="QR Göster"
              onPress={() => navigation.navigate('QRCodeScreen', { envanter: item })}
            />

            <Button
              title="📷 QR Tara"
              onPress={() => navigation.navigate("QRScannerScreen")}
            />

            <View style={{ marginTop: 10 }}>
              <Button
                title="Sil"
                color="red"
                onPress={() => handleSil(item._id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 18,
  },
});

export default EnvanterScreen;
