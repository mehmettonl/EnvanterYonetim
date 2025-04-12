const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();  // Çevresel değişkenler için .env dosyasını yükle

const app = express();
app.use(express.json()); // JSON verisi ile çalışacağımız için
app.use(cors());  // CORS izinlerini aç

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB bağlantısı başarılı"))
.catch((err) => console.error("MongoDB bağlantı hatası:", err));

// --- Raf Schema ---
// Raf kodları ve kapasite bilgisi için
const RafSchema = new mongoose.Schema({
  kod: String,           // Örn: "1A"
  kapasite: Number,      // Örn: 100
  kalan: Number          // Başlangıçta kapasiteyle aynı
});

// --- Envanter Schema ---
// Envanterin tüm özellikleri
const EnvanterSchema = new mongoose.Schema({
  ad: String,
  numara: String,
  toplamRaf: Number,
  raflar: [RafSchema]     // Raflar burada tanımlandı
});

const Envanter = mongoose.model("Envanter", EnvanterSchema);

// 🔧 Raf kodu üretme fonksiyonu
const generateRafKodlari = (adet, harfler = ['A', 'B', 'C', 'D']) => {
  const kodlar = [];
  for (let i = 1; i <= adet; i++) {
    harfler.forEach(harf => kodlar.push(`${i}${harf}`)); // 1A, 1B, 2A, 2B vs.
  }
  return kodlar;
};

// ✅ Yeni envanter ekleme
app.post("/envanter-ekle", async (req, res) => {
  try {
    const { ad, numara, toplamRaf } = req.body;

    const rafKodlari = generateRafKodlari(toplamRaf); // 1A, 1B, 1C...
    const raflar = rafKodlari.map(kod => ({
      kod,
      kapasite: 100,
      kalan: 100,  // Başlangıçta her rafın kapasitesi 100
    }));

    const yeniEnvanter = new Envanter({
      ad,
      numara,
      toplamRaf,
      raflar,
    });

    await yeniEnvanter.save();
    res.status(201).json({
      message: "Envanter başarıyla eklendi",
      yeniEnvanter,
    });
  } catch (error) {
    console.error("Ekleme hatası:", error);
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});

// Tüm envanterleri getirme endpoint'i
app.get("/envanterler", async (req, res) => {
  try {
    const envanterler = await Envanter.find().lean(); // Veritabanından envanterleri al
    res.json(envanterler);
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});

// Envanter Güncelleme
app.put("/envanter-guncelle/:id", async (req, res) => {
  try {
    const { ad, numara, toplamRaf } = req.body;
    const updatedEnvanter = await Envanter.findByIdAndUpdate(
      req.params.id,
      { ad, numara, toplamRaf },
      { new: true }
    );
    if (!updatedEnvanter) {
      return res.status(404).json({ error: "Envanter bulunamadı" });
    }
    res.json({ message: "Güncellendi", updatedEnvanter });
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});

// Envanter Silme
app.delete("/envanter-sil/:id", async (req, res) => {
  try {
    await Envanter.findByIdAndDelete(req.params.id);
    res.json({ message: "Silindi" });
  } catch (error) {
    res.status(500).json({ error: "Silme hatası oluştu" });
  }
});

// Ürün Ekleme
app.put("/urun-ekle", async (req, res) => {
  try {
    const { envanterId, rafKod, miktar } = req.body;
    
    // Envanteri bul
    const envanter = await Envanter.findById(envanterId);
    if (!envanter) {
      return res.status(404).json({ error: "Envanter bulunamadı" });
    }

    // Rafı bul
    const raf = envanter.raflar.find(r => r.kod === rafKod);
    if (!raf) {
      return res.status(404).json({ error: "Raf bulunamadı" });
    }

    // Yeterli boş alan var mı kontrol et
    if (raf.kalan < miktar) {
      return res.status(400).json({ error: "Yeterli boş alan yok" });
    }

    // Raf kapasitesini güncelle
    raf.kalan -= miktar;

    await envanter.save();
    res.json({ message: `${miktar} ürün eklenmiş ve raf kapasitesi güncellenmiştir.` });
  } catch (error) {
    console.error("Ürün ekleme hatası:", error);
    res.status(500).json({ error: "Sunucu hatası oluştu" });
  }
});

// Portu belirle
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});