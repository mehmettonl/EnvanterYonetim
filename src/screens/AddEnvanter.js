import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";

export default function AddEnvanter() {
  const [envanterAdi, setEnvanterAdi] = useState("");
  const [envanterNumarasi, setEnvanterNumarasi] = useState("");
  const [toplamRaf, setToplamRaf] = useState("");

  const handleKaydet = async () => {
    if (!envanterAdi.trim() || !envanterNumarasi.trim() || !toplamRaf.trim()) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }
  
    const toplamRafSayisi = parseInt(toplamRaf, 10);
    if (isNaN(toplamRafSayisi) || toplamRafSayisi <= 0) {
      Alert.alert("Hata", "Toplam raf sayısı geçerli bir sayı olmalıdır.");
      return;
    }
  
    const generateRafKodlari = (adet, harfler = ['A', 'B', 'C', 'D']) => {
      const kodlar = [];
      for (let i = 1; i <= adet; i++) {
        harfler.forEach(harf => kodlar.push(`${i}${harf}`));
      }
      return kodlar;
    };
  
    const rafKodlari = generateRafKodlari(toplamRafSayisi); // ✅ raf kodları üretildi
  
    try {
      const response = await fetch("http://localhost:5001/envanter-ekle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad: envanterAdi,
          numara: envanterNumarasi,
          toplamRaf: toplamRafSayisi,
          rafKodlari: rafKodlari, // ✅ backend’e gönderiliyor
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Başarılı", "Envanter başarıyla eklendi!");
        setEnvanterAdi("");
        setEnvanterNumarasi("");
        setToplamRaf("");
      } else {
        Alert.alert("Hata", data.message || "Bir hata oluştu.");
      }
    } catch (error) {
      Alert.alert("Hata", "Bağlantı hatası.");
    }
  };

  return (
    <View style={{ padding: 20, alignItems: "center" }}>
      <TextInput
        style={styles.input}
        placeholder="Envanter Adı"
        value={envanterAdi}
        onChangeText={setEnvanterAdi}
      />
      <TextInput
        style={styles.input}
        placeholder="Envanter Numarası"
        value={envanterNumarasi}
        onChangeText={setEnvanterNumarasi}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Toplam Raf"
        value={toplamRaf}
        onChangeText={setToplamRaf}
        keyboardType="numeric"
      />
      <Button title="Kaydet" onPress={handleKaydet} />
    </View>
  );
}

const styles = {
  input: {
    width: 300,
    height: 45,
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 20,
    textAlign: "center",
    elevation: 4, // Android gölgelendirme
  },
};