// Tüm envanterleri getir
router.get("/envanterler", async (req, res) => {
    try {
      const envanterler = await Envanter.find();
      res.json(envanterler);
    } catch (error) {
      res.status(500).json({ error: "Veriler alınırken hata oluştu" });
    }
  });
  
  // Belirli bir envanteri getir
  router.get("/envanter/:id", async (req, res) => {
    try {
      const envanter = await Envanter.findById(req.params.id);
      if (!envanter) {
        return res.status(404).json({ message: "Envanter bulunamadı" });
      }
      res.json(envanter);
    } catch (error) {
      res.status(500).json({ error: "Veri alınırken hata oluştu" });
    }
  });
  
  // Envanteri güncelle
  router.put("/envanter-guncelle/:id", async (req, res) => {
    try {
      const { ad, numara } = req.body;
      const envanter = await Envanter.findByIdAndUpdate(req.params.id, { ad, numara }, { new: true });
  
      if (!envanter) {
        return res.status(404).json({ message: "Envanter bulunamadı" });
      }
  
      res.json({ message: "Envanter güncellendi", envanter });
    } catch (error) {
      res.status(500).json({ error: "Güncelleme sırasında hata oluştu" });
    }
  });
  
  // Envanteri sil
  router.delete("/envanter-sil/:id", async (req, res) => {
    try {
      const envanter = await Envanter.findByIdAndDelete(req.params.id);
      if (!envanter) {
        return res.status(404).json({ message: "Envanter bulunamadı" });
      }
      res.json({ message: "Envanter başarıyla silindi" });
    } catch (error) {
      res.status(500).json({ error: "Silme sırasında hata oluştu" });
    }
  });
  
  module.exports = router;