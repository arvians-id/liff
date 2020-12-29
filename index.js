
const tambahMenu = () => {
    if ($('[name="kategori"]').val() == null || $('[name="makanan"]').val() == '' || $('[name="keterangan"]').val() == '' || $('[name="harga"]').val() == '') {
        let showError = `<div class="alert alert-danger" role="alert">
                                Field jangan ada yang kosong!
                            </div>`;
        $('.error').html(showError);
    } else {
        if (localStorage.dataMakanan && localStorage.idMakanan) {
            dataMakanan = JSON.parse(localStorage.getItem('dataMakanan'));
            idMakanan = parseInt(localStorage.getItem('idMakanan'));
        } else {
            dataMakanan = [];
            idMakanan = 0;
        }
        idMakanan++;
        const data = { 'id': idMakanan, 'kategori': $('[name="kategori"]').val(), 'makanan': $('[name="makanan"]').val(), 'keterangan': $('[name="keterangan"]').val(), 'harga': $('[name="harga"]').val() };
        dataMakanan.push(data);
        localStorage.setItem('dataMakanan', JSON.stringify(dataMakanan));
        localStorage.setItem('idMakanan', idMakanan);

        $('#form-tambah-makanan')[0].reset();
        $('.error').html();
        alert('Menu berhasil ditambah');
        location.reload();
    }
}

const hapusMasterMakanan = id => {
    if (confirm('Yakin ingin menghapus menu ini?')) {
        const dataMakanan = JSON.parse(localStorage.getItem('dataMakanan'));
        let startDelete = 0;
        dataMakanan.forEach((val, i) => {
            if (val.id == id) {
                dataMakanan.splice(startDelete, 1)
            }
            startDelete++;
        })
        localStorage.setItem('dataMakanan', JSON.stringify(dataMakanan));
        location.reload();
    }
}

const add = id => {
    const dataMakanan = JSON.parse(localStorage.getItem('dataMakanan'));
    dataMakanan.forEach((val, i) => {
        if (val.id == id) {
            if (localStorage.pesanan && localStorage.idPesanan) {
                pesanan = JSON.parse(localStorage.getItem('pesanan'));
                idPesanan = parseInt(localStorage.getItem('idPesanan'));
            } else {
                pesanan = [];
                idPesanan = 0;
            }
            idPesanan++;
            const data = { 'id': idPesanan, 'idMakanan': id, 'makanan': val.makanan, 'harga': val.harga };
            pesanan.push(data);
            localStorage.setItem('pesanan', JSON.stringify(pesanan));
            localStorage.setItem('idPesanan', idPesanan);
        }
    })

    let totalHarga = pesanan.reduce(function (val, element) {
        return val + parseInt(element.harga);
    }, 0);
    $('#totalPesanan').html(pesanan.length > 0 ? "Total Pesanan : " + pesanan.length : '');
    $('#totalHarga').html(totalHarga != 0 ? "Total Harga : Rp. " + totalHarga : '');
    localStorage.setItem('totalHarga', totalHarga);
    $('[name="hidangan' + id + '"]').val(pesanan.filter(item => (item.idMakanan == id)).length);
    $('.jmlPesanan').html(pesanan.length);
    dataPesanan();
}

const min = id => {
    const dataMakanan = JSON.parse(localStorage.getItem('dataMakanan'));
    const pesanan = JSON.parse(localStorage.getItem('pesanan'));
    let index = pesanan.map(item => item.idMakanan).indexOf(id);
    if (index > -1) {
        pesanan.splice(index, 1);
    }
    localStorage.setItem('pesanan', JSON.stringify(pesanan));

    let sum = 0;
    dataMakanan.forEach((val, i) => {
        if (parseInt(localStorage.totalHarga) > 0) {
            if (val.id == id) {
                sum = parseInt(localStorage.totalHarga) - val.harga;
            }
        } else {
            sum = 0;
        }
    })
    localStorage.setItem('totalHarga', sum);
    $('#totalPesanan').html(pesanan.length > 0 ? "Total Pesanan : " + pesanan.length : '');
    $('#totalHarga').html(localStorage.totalHarga != 0 ? "Total Harga : Rp. " + localStorage.totalHarga : '');
    $('[name="hidangan' + id + '"]').val(pesanan.filter(item => (item.idMakanan == id)).length);
    $('.jmlPesanan').html(pesanan.length);
    dataPesanan();
}
const dataPesanan = () => {
    let showPesanan = '';
    const dataPesanan = JSON.parse(localStorage.getItem('pesanan'));
    if (dataPesanan != null) {
        dataPesanan.forEach((val, i) => {
            showPesanan += `<tr>
                                <td scope="row">${(i + 1)}</td>
                                <td>${val.makanan}</td>
                                <td>Rp. ${val.harga}</td>
                            </tr> `;
        })
    } else {
        showPesanan = `<tr>
                            <td colspan="3">
                                <div class="alert alert-danger" role="alert">
                                    Pesanan kamu masih kosong nih, yuk pesen dulu sekarang.
                                </div>
                            </td>
                        </tr>`;
    }
    $('#showPesanan').html(showPesanan);
}
const pesanSekarang = () => {
    const dataPesanan = JSON.parse(localStorage.getItem('pesanan'));
    if (dataPesanan.length > 0) {
        const totalHarga = localStorage.getItem('totalHarga');
        liff.getProfile()
            .then(profile => {
                const name = profile.displayName;
            })
            .catch((err) => {
                console.log('error', err);
            })

        let data = `--- KANTENEN AJA ---\n Hi ${name},\n\nTerima kasih telah memesan di Kantenen Aja, berikut ini adalah daftar pesanan kamu\n\nPesanan Kamu : ${dataPesanan.map(item => item.makanan).join(',')}\nTotal Pesanan : ${dataPesanan.length}\nTotal Harga : ${totalHarga}\n\nPesanan kamu akan segera diproses ya jadi mohon tunggu sebentar :) Terima Kasih`;

        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            liff.sendMessages([{
                'type': 'text',
                'text': data
            }]).then(function () {
                alert('Berhasil, pesanan kamu akan segera dibuatkan yaa');
            }).catch(function (error) {
                alert('Aduh kok error ya...' + error);
            });
        }
    } else {
        alert('Kamu belum memilih makanan nih:( yuk cari makan dulu')
    }
}
$(document).ready(function () {
    dataPesanan();
    const dataMakanan = JSON.parse(localStorage.getItem('dataMakanan'));
    let showData = '';

    if (dataMakanan.length > 0) {
        dataMakanan.forEach((val, i) => {
            showData += `<tr>
                                <td scope="row">${(i + 1)}</td>
                                <td>${val.kategori}</td>
                                <td>${val.makanan}</td>
                                <td>${val.keterangan}</td>
                                <td>Rp. ${val.harga}</td>
                                <td><button class="btn btn-danger" onclick="hapusMasterMakanan(${val.id})">Hapus</button></td>
                            </tr>`;
        })
    } else {
        showData = `<tr>
                                <td colspan="6">
                                    <div class="alert alert-danger" role="alert">
                                        Menu makanan belum ada nih, yuk tambah menu dulu.
                                    </div>
                                </td>
                            </tr>`;
    }
    $('#showMasterMakanan').html(showData);

    let showMenu = '';
    let showMenuMakanan = '';
    dataMakanan.forEach((val, i) => {
        if (val.kategori == 'Makanan') {
            showMenu += `<div class="col-12 col-md-4">
                                <div class="card mb-2" style="max-width: 540px;">
                                    <div class="row no-gutters">
                                        <div class="col-4 col-md-12">
                                            <img src="public/2.png" class="card-img pt-3 pr-3 pl-3" style="border-radius: 25px;">
                                            <div class="text-center p-2">
                                                <a href="javascript:void(0);" class="btn btn-danger btn-sm rounded-lg min" onclick="min(${val.id})">-</a>
                                                <input type="text" name="hidangan${val.id}" value="0" class="border-0" size="1" readonly>
                                                <a href="javascript:void(0);" class="btn btn-danger btn-sm rounded-lg add" onclick="add(${val.id})">+</a>
                                            </div>
                                        </div>
                                        <div class="col-8 col-md-12">
                                            <div class="card-body">
                                                <h5 class="card-title">${val.makanan}</h5>
                                                <p class="card-text">${val.keterangan}</p>
                                                <p class="card-text"><small class="text-muted"><b>Rp. ${val.harga}</b></small></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
        }
        $('#showMenu').html(showMenu);
        if (val.kategori == 'Minuman') {
            showMenuMakanan += `<div class="col-12 col-md-4">
                                        <div class="card mb-3" style="max-width: 540px;">
                                            <div class="row no-gutters">
                                                <div class="col-4 col-md-12">
                                                    <img src="public/2.png" class="card-img pt-3 pr-3 pl-3" style="border-radius: 25px;">
                                                    <div class="text-center p-2">
                                                        <a href="javascript:void(0);" class="btn btn-danger btn-sm rounded-lg min" onclick="min(${val.id})">-</a>
                                                        <input type="text" name="hidangan${val.id}" value="0" class="border-0" size="1" readonly>
                                                        <a href="javascript:void(0);" class="btn btn-danger btn-sm rounded-lg add" onclick="add(${val.id})">+</a>
                                                    </div>
                                                </div>
                                                <div class="col-8 col-md-12">
                                                    <div class="card-body">
                                                        <h5 class="card-title">${val.makanan}</h5>
                                                        <p class="card-text">${val.keterangan}</p>
                                                        <p class="card-text"><small class="text-muted"><b>Rp. ${val.harga}</b></small></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
        }
        $('#showMenuMinuman').html(showMenuMakanan);
    })
})