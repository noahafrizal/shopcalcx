const root = document.getElementById('root');

function formatRp(x) {
  return 'Rp' + x.toLocaleString('id-ID');
}

// UI
root.innerHTML = `
  <h2>Kalkulator Simulasi Laba Shopee</h2>
  <div class="mb-3">
    <label>Harga Beli:</label>
    <input id="hargaBeli" type="number" class="form-control" value="3000" />
  </div>
  <div class="mb-3">
    <label>Harga Jual:</label>
    <input id="hargaJual" type="number" class="form-control" value="4500" />
  </div>
  <div class="mb-3">
    <label>Admin (% dari harga jual):</label>
    <input id="adminPersen" type="number" class="form-control" value="12" />
  </div>
  <div class="mb-3">
    <label>Biaya Packing (per order):</label>
    <input id="packing" type="number" class="form-control" value="500" />
  </div>
  <div class="mb-3">
    <label>Biaya Proses (per order):</label>
    <input id="proses" type="number" class="form-control" value="1250" />
  </div>
  <button id="hitungBtn" class="btn btn-primary mb-3">Hitung</button>
  <div id="hasilHitung" class="mb-3"></div>
  <hr>
  <div class="form-check mb-2">
    <input class="form-check-input" type="checkbox" value="" id="grosirCheck">
    <label class="form-check-label" for="grosirCheck">Simulasi Harga Bertingkat (Grosir)</label>
  </div>
  <div id="grosirOptions" style="display: none;">
    <div class="mb-2">
      <label>Laba Bersih %:</label>
      <input id="labaPersen" type="number" class="form-control" placeholder="Contoh: 10">
    </div>
    <div class="mb-2">
      <label>Laba Bersih Rp:</label>
      <input id="labaRupiah" type="number" class="form-control" placeholder="Contoh: 1000">
    </div>
    <div class="mb-2">
      <label>Laba Kotor:</label>
      <input id="labaKotor" type="number" class="form-control" placeholder="Contoh: 4000">
    </div>
    <button id="simulasiBtn" class="btn btn-success">Simulasikan</button>
    <div id="hasilSimulasi" class="mt-3"></div>
  </div>
`;

function hitungLaba() {
  const hargaBeli = +document.getElementById('hargaBeli').value;
  const hargaJual = +document.getElementById('hargaJual').value;
  const adminPersen = +document.getElementById('adminPersen').value;
  const packing = +document.getElementById('packing').value;
  const proses = +document.getElementById('proses').value;

  const adminFee = hargaJual * (adminPersen/100);
  const labaKotor = hargaJual - hargaBeli;
  const totalBiaya = adminFee + packing + proses;
  const labaBersih = hargaJual - hargaBeli - totalBiaya;

  document.getElementById('hasilHitung').innerHTML = `
    <table class="table table-sm">
      <tr><th>Laba Kotor</th><td>${formatRp(labaKotor)}</td></tr>
      <tr><th>Admin Fee</th><td>${formatRp(adminFee)}</td></tr>
      <tr><th>Biaya Packing</th><td>${formatRp(packing)}</td></tr>
      <tr><th>Biaya Proses</th><td>${formatRp(proses)}</td></tr>
      <tr><th>Total Biaya</th><td>${formatRp(totalBiaya)}</td></tr>
      <tr class="${labaBersih < 0 ? 'table-danger' : 'table-success'}"><th>Laba Bersih</th><td>${formatRp(labaBersih)}</td></tr>
    </table>
  `;
}

function simulasiGrosir() {
  const hargaBeli = +document.getElementById('hargaBeli').value;
  const adminPersen = +document.getElementById('adminPersen').value;
  const packing = +document.getElementById('packing').value;
  const proses = +document.getElementById('proses').value;
  const labaPersen = +document.getElementById('labaPersen').value;
  const labaRupiah = +document.getElementById('labaRupiah').value;
  const labaKotorInput = +document.getElementById('labaKotor').value;

  let hasil = `<table class="table table-bordered table-sm">
    <thead>
      <tr>
        <th>Jumlah Beli</th>
        <th>Harga Jual /pcs</th>
        <th>Laba Kotor</th>
        <th>Admin Fee</th>
        <th>Biaya Packing</th>
        <th>Biaya Proses</th>
        <th>Total Biaya</th>
        <th>Laba Bersih</th>
      </tr>
    </thead>
    <tbody>
  `;

  const promoLines = ['Beli Banyak, Lebih Murah!!'];

  for (let n = 1; n <= 10; n++) {
    let X = 0;
    if (labaKotorInput > 0) {
      // Prioritaskan Laba Kotor jika diisi
      X = (hargaBeli + labaKotorInput) * n;
    } else if (labaPersen > 0) {
      const modal = hargaBeli * n;
      const packingTot = packing;
      const prosesTot = proses;
      const adminFrac = adminPersen / 100;
      const labaFrac = labaPersen / 100;
      const biayaTetap = modal + packingTot + prosesTot;
      X = biayaTetap / (1 - adminFrac - labaFrac);
    } else if (labaRupiah > 0) {
      const modal = hargaBeli * n;
      const packingTot = packing;
      const prosesTot = proses;
      const adminFrac = adminPersen / 100;
      X = (modal + packingTot + prosesTot + (labaRupiah * n)) / (1 - adminFrac);
    } else {
      continue;
    }

    const hargaJualPcs = Math.ceil(X / n);
    const hargaJualTotal = hargaJualPcs * n;
    const labaKotor = hargaJualTotal - (hargaBeli * n);
    const adminFee = hargaJualTotal * (adminPersen/100);
    const totalBiaya = adminFee + packing + proses;
    const labaBersih = hargaJualTotal - (hargaBeli * n) - totalBiaya;

    hasil += `
      <tr>
        <td>${n}</td>
        <td>${formatRp(hargaJualPcs)}</td>
        <td>${formatRp(labaKotor)}</td>
        <td>${formatRp(adminFee)}</td>
        <td>${formatRp(packing)}</td>
        <td>${formatRp(proses)}</td>
        <td>${formatRp(totalBiaya)}</td>
        <td class="${labaBersih < 0 ? 'table-danger' : 'table-success'}">${formatRp(labaBersih)}</td>
      </tr>
    `;

    promoLines.push(`Beli ${n} ${formatRp(hargaJualPcs)} /pcs`);
  }
  hasil += '</tbody></table>';
  promoLines.push('Beli Banyak, Untung Banyak!');
  const promoText = promoLines.join('\n');
  hasil += `
    <textarea id="promoText" class="form-control mt-2" rows="12" readonly>${promoText}</textarea>
    <button id="copyPromoBtn" class="btn btn-secondary mt-2">Copy Text</button>
  `;
  document.getElementById('hasilSimulasi').innerHTML = hasil;
  const copyBtn = document.getElementById('copyPromoBtn');
  copyBtn.addEventListener('click', () => navigator.clipboard.writeText(promoText));
}

document.getElementById('hitungBtn').onclick = hitungLaba;

const grosirCheck = document.getElementById('grosirCheck');
const grosirOptions = document.getElementById('grosirOptions');
grosirCheck.addEventListener('change', function() {
  grosirOptions.style.display = grosirCheck.checked ? 'block' : 'none';
});

document.getElementById('simulasiBtn').onclick = simulasiGrosir;
