import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function EditEnvanterScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { _id, ad, numara, toplamRaf, rafKodlari = [] } = route.params;

  const [envanterAdi, setEnvanterAdi] = useState(ad);
  const [envanterNumarasi, setEnvanterNumarasi] = useState(numara);
  const [envanterRaf, setEnvanterRaf] = useState(toplamRaf.toString());

  const handleGuncelle = async () => {
    if (!envanterAdi.trim() || !envanterNumarasi.trim() || !envanterRaf.trim()) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    const rafSayisi = parseInt(envanterRaf, 10);
    if (isNaN(rafSayisi) || rafSayisi < 0) {
      Alert.alert("Hata", "Toplam raf sayısı geçerli bir sayı olmalıdır.");
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.147:5001/envanter-guncelle/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ad: envanterAdi,
          numara: envanterNumarasi,
          toplamRaf: rafSayisi,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Başarılı", "Envanter başarıyla güncellendi!");
        navigation.goBack();
      } else {
        Alert.alert("Hata", data.error || "Bir hata oluştu.");
      }
    } catch (error) {
      Alert.alert("Hata", "Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Envanter Güncelle</Text>

      <TextInput
        placeholder="Envanter Adı"
        value={envanterAdi}
        onChangeText={setEnvanterAdi}
        style={styles.input}
      />
      <TextInput
        placeholder="Envanter Numarası"
        value={envanterNumarasi}
        onChangeText={setEnvanterNumarasi}
        style={styles.input}
      />
      <TextInput
        placeholder="Toplam Raf"
        value={envanterRaf}
        onChangeText={setEnvanterRaf}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.subTitle}>📚 Raf Kodları:</Text>
      <View style={styles.rafContainer}>
        {rafKodlari.length === 0 ? (
          <Text style={{ color: 'white' }}>Raf kodu bulunamadı</Text>
        ) : (
          rafKodlari.map((kod, index) => (
            <Text key={index} style={styles.rafItem}>{kod}</Text>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGuncelle}>
        <Text style={styles.buttonText}>Güncelle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  input: {
    width: 300,
    height: 45,
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 20,
    textAlign: "center",
    elevation: 4,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "white",
    textAlign: "center",
  },
  rafContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
  },
  rafItem: {
    backgroundColor: "#fff",
    color: "#000",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    margin: 4,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#ff5733",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    width: 300,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});