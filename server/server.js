const app = require('./app');
const server = require('http').createServer(app);
const io = require("socket.io").listen(server);
const { oyunBaşlat, oyuncuBul } = require('./module');

let currentPlayer = 1;
let taşÇek = false;
let onlineOyuncular = new Array; //TODO: 4 kişiden fazla olmamalı!

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
    if (onlineOyuncular.length === 4) {
      const [ göstergeTaşı, onlineListe ] = oyunBaşlat(onlineOyuncular);  // Multiple return alma işlemi böyle.
      onlineOyuncular = onlineListe;
      let kendiDestesi = function(oyuncu, index) {
        // Hepsini tek obje olarak yolla. Client'ta yakala.
        io.to(oyuncu.id).emit('oyun bilgisi', "Oyun başlıyor...");
        io.to(oyuncu.id).emit('gösterge taşı', göstergeTaşı);
        io.to(oyuncu.id).emit('your board', onlineOyuncular[index].destesi);
        io.to(oyuncu.id).emit('player', {
          current: currentPlayer, 
          you: onlineOyuncular[index].player,
          ilkBaşlar: oyuncu.isFirstPlayer
          // yourDeck + Gösterge falan tek seferde buradan gönderilebilir.
        });
        // console.log(index + ' : ' + element + ' - ' + array[index])
      };
      onlineOyuncular.forEach(kendiDestesi);
    };
  });

  socket.on("id0-taş", (element) => {
    console.log(element);
    // var öncekiTaş = {
    //   taşıYollayan: oyuncuSırası,
    //   taş: element.taş
    // };
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

  socket.on('disconnect', () => {
    console.log('Disconnected: ' + soketID);
    onlineOyuncular = onlineOyuncular.filter(item => item.id !== soketID);
    console.log(onlineOyuncular);
    io.emit('oyuncular', onlineOyuncular);
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});