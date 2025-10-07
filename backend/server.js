const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Agar API bisa diakses dari domain lain (frontend)
app.use(express.json()); // Agar bisa membaca body request dalam format JSON

// --- Database Sederhana (menggunakan array) ---
let transactions = [
    { id: 1, deskripsi: 'Gaji Bulanan', jumlah: 5000000, tipe: 'pemasukan', tanggal: '2025-10-01' },
    { id: 2, deskripsi: 'Bayar Kos', jumlah: 1000000, tipe: 'pengeluaran', tanggal: '2025-10-05' },
    { id: 3, deskripsi: 'Belanja Bulanan', jumlah: 750000, tipe: 'pengeluaran', tanggal: '2025-10-06' },
];
let nextId = 4;

// --- API Endpoints ---

// [GET] Mengambil semua transaksi
app.get('/api/transaksi', (req, res) => {
    res.json(transactions);
});

// [POST] Menambah transaksi baru
app.post('/api/transaksi', (req, res) => {
    const { deskripsi, jumlah, tipe } = req.body;

    if (!deskripsi || !jumlah || !tipe) {
        return res.status(400).json({ message: 'Semua field harus diisi!' });
    }

    const newTransaction = {
        id: nextId++,
        deskripsi,
        jumlah: parseInt(jumlah),
        tipe,
        tanggal: new Date().toISOString().split('T')[0] // Tanggal hari ini YYYY-MM-DD
    };

    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
});

// [DELETE] Menghapus transaksi
app.delete('/api/transaksi/:id', (req, res) => {
    const idToDelete = parseInt(req.params.id);
    transactions = transactions.filter(t => t.id !== idToDelete);
    res.status(204).send(); // Sukses, tidak ada konten balasan
});


// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server backend berjalan di http://localhost:${PORT}`);
});