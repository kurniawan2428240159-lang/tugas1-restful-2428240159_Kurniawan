const express = require('express');
const app = express();

app.use(express.json());
let skincareProducts = [
    { id: 1, nama: "Gel Pembersih Wajah", merek: "Kulitku", jenisKulit: "berminyak", harga: 49000, nomorBpom: "NA18260100123" },
    { id: 2, nama: "Moisturizer Gel", merek: "GlowUp", jenisKulit: "kering", harga: 75000, nomorBpom: "NA18260100124" },
    { id: 3, nama: "Sunscreen SPF 50", merek: "SunProtect", jenisKulit: "normal", harga: 60000, nomorBpom: "NA18260100125" }
];
let nextId = 4;

app.get('/', (req, res) => {
    res.json({
        nama: "Kurniawan",
        nim: "2428240159",
        topik: "Kosmetik - Produk Skincare",
        endpoints: [
            "GET /skincare-products",
            "GET /skincare-products/:id",
            "POST /skincare-products",
            "PUT /skincare-products/:id",
            "DELETE /skincare-products/:id"]
    });
});

app.get('/skincare-products', (req, res) => {
  let { jenisKulit, nama } = req.query;
  let hasil = skincareProducts;
  if (jenisKulit) {
    hasil = hasil.filter(p => p.jenisKulit.toLowerCase() === jenisKulit.toLowerCase());
  }
  if (nama) {
    hasil = hasil.filter(p => p.nama.toLowerCase().includes(nama.toLowerCase()));
  }

  res.status(200).json({
    status: "success",
    message: "Data produk skincare berhasil diambil",
    data: hasil
  });
});

app.get('/skincare-products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = skincareProducts.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({
            status: "error",
            message: `Data dengan id ${id} tidak ditemukan`,
            data: null
        });
    }
    res.json(product);
});

app.post('/skincare-products', (req, res) => {
    const { nama, merek, jenisKulit, harga, nomorBpom } = req.body;
    if (!nama || !merek || !jenisKulit || !harga || !nomorBpom) {
        return res.status(400).json({
            status: "error",
            message: "Field nama, merek, jenisKulit, harga, dan nomorBpom wajib diisi",
            data: null
        });
    }
    const baru = { id: nextId++, nama, merek, jenisKulit, harga, nomorBpom };
    skincareProducts.push(baru);

    res.status(201).json({
        status: "success",
        message: "Data berhasil ditambahkan",
        data: baru
    });
});

app.put('/skincare-products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = skincareProducts.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null
    });
  }
  const { nama, merek, jenisKulit, harga, nomorBpom } = req.body;
  if (!nama || !merek || !jenisKulit || !harga || !nomorBpom) {
    return res.status(400).json({
      status: "error",
      message: "Field nama, merek, jenisKulit, harga, dan nomorBpom wajib diisi",
      data: null
    });
  }
  skincareProducts[index] = { id, nama, merek, jenisKulit, harga, nomorBpom };
  res.status(200).json({
    status: "success",
    message: "Data berhasil diperbarui",
    data: skincareProducts[index]
  });
});

app.delete('/skincare-products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = skincareProducts.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null
    });
  }
  skincareProducts.splice(index, 1);
  res.status(200).json({
    status: "success",
    message: `Data skincare dengan id ${id} berhasil dihapus`,
    data: null
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
    data: null
  });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
}

module.exports = app;