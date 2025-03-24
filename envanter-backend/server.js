const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // ✅ `.env` dosyasını yükle

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB bağlantısı başarılı"))
  .catch(err => console.error("MongoDB bağlantı hatası:", err));

// Envanter Modeli
const EnvanterSchema = new mongoose.Schema({
  ad: String,
  numara: String,
  toplamRaf: Number,
  rafKodlari: String, // ← eklendi!
});

const Envanter = mongoose.model("Envanter", EnvanterSchema);

// Yeni envanter ekleme endpoint'i
app.post("/envanter-ekle", async (req, res) => {
  try {
    const { ad, numara, toplamRaf } = req.body;
    const yeniEnvanter = new Envanter({
      ad,
      numara,
      toplamRaf,
    });
    await yeniEnvanter.save();
    res.status(201).json({
      message: "Envanter başarıyla eklendi",
      yeniEnvanter,
    });
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});

// Tüm envanterleri getirme endpoint'i
app.get("/envanterler", async (req, res) => {
  try {
    const envanterler = await Envanter.find();
    res.json(envanterler);
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});

app.put("/envanter-guncelle/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ad, numara, toplamRaf } = req.body;

    const updatedEnvanter = await Envanter.findByIdAndUpdate(
      id,
      { ad, numara, toplamRaf },
      { new: true } // Güncellenmiş veriyi dönmesi için
    );

    if (!updatedEnvanter) {
      return res.status(404).json({ error: "Envanter bulunamadı" });
    }

    res.json({
      message: "Envanter başarıyla güncellendi",
      updatedEnvanter,
    });
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});

app.delete("/envanter-sil/:id", async (req, res) => {
  try {
    console.log("Silme isteği geldi! ID:", req.params.id); // ← burası önemli
    await Envanter.findByIdAndDelete(req.params.id);
    res.json({ message: "Envanter başarıyla silindi" });
  } catch (error) {
    console.error("Silme hatası:", error);
    res.status(500).json({ error: "Envanter silinirken bir hata oluştu." });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});