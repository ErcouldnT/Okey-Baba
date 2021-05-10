const app = require('./app');
const server = require('http').createServer(app);
const io = require("socket.io").listen(server);
const { oyunBaşlat, oyuncuBul } = require('./module');

let onlineOyuncular = new Array; //TODO: 4 kişiden fazla olmamalı!
let currentPlayer = 1;
let taşÇek = false;
let kalan_deste = [];

io.on('connection', (socket) => {
  const soketID = socket.id;
  console.log('Kullanıcı bağlandı: ' + soketID);
  io.emit('oyuncular', onlineOyuncular);

  socket.on('isim bilgisi', (isim) => {
    // console.log('Kullanıcı ismi geldi: ' + isim);
    isim = isim.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    const oyuncuIndex = onlineOyuncular.length + 1;
    const oyuncu = { player: oyuncuIndex, id: soketID, adı: isim };
    // Tek satır if-statement'a dönüştür.
    if ( onlineOyuncular.length === 0 ) {
      oyuncu.isFirstPlayer = true;
    };
    onlineOyuncular.push(oyuncu);
    console.log(onlineOyuncular);
    io.emit('oyuncular', onlineOyuncular);  //TODO: 4'ten fazla olmamalı!
    // io.emit('client konsol', isim);  // İsim bilgisini herkese gönder.
    if (onlineOyuncular.length === 4) { // TEST AMAÇLI === 1 ELSE 4.
      const [ okeytaşı, göstergeTaşı, onlineListe, remaining_deck ] = oyunBaşlat(onlineOyuncular);  // Multiple return alma işlemi böyle.
      onlineOyuncular = onlineListe;
      kalan_deste = remaining_deck;
      okey = okeytaşı;
      let currentPlayer = 1;
      let kendiDestesi = function(oyuncu, index) {
        // Hepsini tek obje olarak yolla. Client'ta yakala.
        io.to(oyuncu.id).emit('oyun bilgisi', "Oyun başlıyor...");
        io.to(oyuncu.id).emit('gösterge taşı', göstergeTaşı);
        io.to(oyuncu.id).emit('your board', onlineOyuncular[index].destesi);
        io.to(oyuncu.id).emit('player', {
          current: currentPlayer, 
          you: onlineOyuncular[index].player,
          ilkBaşlar: oyuncu.isFirstPlayer,
          okeytaşı: okey,
        });
      };
      onlineOyuncular.forEach(kendiDestesi);
    };
  });

  socket.on("yere taş at", (element) => {
    console.log(element);
    try {
      // Server-side validation:
      const oyuncuyuBul = oyuncuBul(soketID, onlineOyuncular);
      var oyuncuSırası = oyuncuyuBul[0].player;
      if (oyuncuSırası === currentPlayer) {
        currentPlayer += 1;
        if (currentPlayer === 5) {  // 4'ten fazla oyuncu yok, tekrar 1'e dön.
          currentPlayer = 1;
        };
        taşÇek = true;
        io.emit('current player', {
          current: currentPlayer,
          taşHakkı: taşÇek
        });
        io.emit('masa taşı', {
          taşıYollayan: oyuncuSırası,
          taş: element.taş
        });
      };
    } catch (error) {
      console.log(error);
      // Atılan taşların backup'ını tut. Biri taş çektiğinde alttaki görünsün.
      // let id0_list = new Array;
      // let id1_list = new Array;
      // let id2_list = new Array;
      // let id3_list = new Array;
    };
  });

  socket.on('yeni taş iste', (bilgi) => {
    const oyuncuyu_bul = oyuncuBul(soketID, onlineOyuncular);
    // Yeni taşı oyuncunun destesine eklemeyi unutma.
    //oyuncuyu_bul[0].destesi.push(yeni_taş); Bu çalışmaz aga 90%.
    var oyuncu_destesi = oyuncuyu_bul[0].destesi;

    let yeni_taş = kalan_deste.pop();  // shift() de kullanılabilir.
    io.to(soketID).emit('yeni taş', yeni_taş);

    console.log("Kalan yeni taş sayısı: " + kalan_deste.length);
    io.emit('kalan taş sayısı', kalan_deste.length);
  });

  socket.on('taş çeken oyuncu', (info) => {
    socket.broadcast.emit('taş çeken oyuncu', info.player);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected: ' + soketID);
    onlineOyuncular = onlineOyuncular.filter(item => item.id !== soketID);
    console.log(onlineOyuncular);
    io.emit('oyuncular', onlineOyuncular);
    // io.emit 'oyuncu düştü.'
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});