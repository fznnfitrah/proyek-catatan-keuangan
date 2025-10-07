// PENTING! Ganti alamat IP ini dengan IP Container Backend Anda nanti saat deploy.
const API_URL = 'http://<IP_BACKEND_ANDA>:3000/api/transaksi';

// DOM Elements
const listTransaksi = document.getElementById('list-transaksi');
const form = document.getElementById('form-transaksi');
const deskripsiInput = document.getElementById('deskripsi');
const jumlahInput = document.getElementById('jumlah');
const pemasukanSpan = document.getElementById('pemasukan');
const pengeluaranSpan = document.getElementById('pengeluaran');
const saldoSpan = document.getElementById('saldo');

// Fungsi untuk format Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

// Fungsi utama untuk mengambil data dan render UI
async function loadAndRender() {
    try {
        const response = await fetch(API_URL);
        const transactions = await response.json();

        // Kosongkan list
        listTransaksi.innerHTML = '';

        let totalPemasukan = 0;
        let totalPengeluaran = 0;

        transactions.forEach(t => {
            // Tambahkan item ke list
            const item = document.createElement('li');
            item.className = t.tipe; // Menambahkan class 'pemasukan' atau 'pengeluaran'
            item.innerHTML = `
                <span>${t.deskripsi} (${t.tanggal})</span>
                <span>${formatRupiah(t.jumlah)}</span>
                <button onclick="deleteTransaction(${t.id})">X</button>
            `;
            listTransaksi.appendChild(item);

            // Kalkulasi summary
            if (t.tipe === 'pemasukan') {
                totalPemasukan += t.jumlah;
            } else {
                totalPengeluaran += t.jumlah;
            }
        });

        // Update summary
        pemasukanSpan.textContent = formatRupiah(totalPemasukan);
        pengeluaranSpan.textContent = formatRupiah(totalPengeluaran);
        saldoSpan.textContent = formatRupiah(totalPemasukan - totalPengeluaran);

    } catch (error) {
        console.error('Gagal memuat data:', error);
        listTransaksi.innerHTML = '<li>Gagal memuat data dari server.</li>'
    }
}

// Event listener untuk form submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const deskripsi = deskripsiInput.value;
    const jumlah = jumlahInput.value;
    const tipe = document.querySelector('input[name="tipe"]:checked').value;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deskripsi, jumlah, tipe }),
    });

    form.reset();
    loadAndRender();
});

// Fungsi untuk hapus transaksi
async function deleteTransaction(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadAndRender();
}

// Panggil fungsi saat halaman pertama kali dibuka
loadAndRender();