const express = require('express');
const app = express();
app.enable('trust proxy');
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io").listen(server);
var _ = require('underscore');

require('dotenv').config();
app.use(express.static('client'))

let onlineOyuncular = new Array;  //TODO: 4 kişiden fazla olmamalı!
let currentPlayer = 1;
let taşÇek = false;

// TODO: Bunun yerine underscore kullan...
Object.defineProperty(Array.prototype, 'shuffle', {
  value: function() {
      for (let i = this.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this[i], this[j]] = [this[j], this[i]];
      }
      return this;
  }
});

//TODO: Function haline getir. Her oyunda yeniden taşları dağıtsın.

function oyunBaşlat() {
  sayılar = ["1","2","3","4","5","6","7","8","9","10","11","12","13"];
  // ,"4","5","6","7","8","9","10","11","12","13"
  renkler = ["Kırmızı", "Sarı", "Siyah", "Mavi"];
  deste = new Array;
  aktifOyuncu = new Array;
  
  const Taş = {
    isOkey: false,
    isGösterge: false,
    isSahteOkey: false,
    adı: function() {
      return `${this.renk} (${this.sayı})`;
    },
    adıYaz: function() {
      console.log(`${this.renk} (${this.sayı})`);
    }
  };
  
  const sahte = Object.create(Taş);
  sahte.renk = "";
  // Sıralama yaparken sonda her alması için: NO.
  sahte.sayı = "";
  sahte.isSahteOkey = true;
  
  function sahteOkeyeDeğerVerici(sahtetaş) {
    // Sahte okey'e gerçek okey'in değerlerini ver.
    if (sahtetaş.isSahteOkey) {
      sahtetaş.renk = okeytaşı.renk;
      sahtetaş.sayı = okeytaşı.sayı;
    };
  };

  // Okey seçildikten sonra push'la. Böylece Sahtenin okey seçilme ihtimali sıfır.
  // deste.push(sahte);
  // deste.push(sahte);  // İki tane Sahte okey olacak.
  
  for (let renk = 0; renk < renkler.length; renk++) {
    for (let sayı = 0; sayı < sayılar.length; sayı++) {
      let me = Object.create(Taş);
      me.renk = renkler[renk];
      me.sayı = sayılar[sayı];
      // me.adı();
      deste.push(me);
      deste.push(me);  // Her taştan 2 adet.
    };
  };
  
  deste.shuffle();  // İlk karıştırma.
  
  // TODO: Sahte okeyi, Okey seçme! --BU İHTİMAL SIFIR. Sahte daha sonra push edilecek.
  // İlk taşı Okey olarak seç. Eşi otomatik seçilir.
  const okeytaşı = deste[0];
  okeytaşı.isOkey = true;
  // const okeytaşı = deste.find(taş => taş.isOkey = true);
  console.log(okeytaşı);

  sahteOkeyeDeğerVerici(sahte);
  deste.push(sahte);
  deste.push(sahte);
  
  for (let i = 0; i < deste.length; i++) {
    const taş = deste[i];
    
    // TODO: Okey = 1 ise Göstergeyi 13'e yönlendir!
    if (okeytaşı.sayı !== "1") {
      if (taş.renk === okeytaşı.renk && Number(taş.sayı) === Number(okeytaşı.sayı) - 1) {
        const göstergeTaşı = taş;
        göstergeTaşı.isGösterge = true;
        console.log(göstergeTaşı);
        break
      }
    } else {
      if (taş.renk === okeytaşı.renk && taş.sayı === "13") {
        const göstergeTaşı = taş;
        göstergeTaşı.isGösterge = true;
        console.log(göstergeTaşı);
        break
      }
    }
  }
  deste.shuffle();  // Son karıştırma. Sahte okey eklendikten sonra.
  
  const göstergeTaşı = _.where(deste, { isGösterge: true })[0];
  
  function desteSırala(deste) {
    deste.sort((a, b) => {
      return a.sayı - b.sayı;
    });
  };
  
  // console.log(deste);
  // console.log(deste.length);
  
  for (let oyuncu = 0; oyuncu < onlineOyuncular.length; oyuncu++) {
    // const oyuncuAdı = onlineOyuncular[oyuncu].adı;
    // const oyuncuID = onlineOyuncular[oyuncu].id;
    // let oyuncuYarat = Object.create(Oyuncu);
    // oyuncuYarat.oyuncuID = oyuncuID;
    // oyuncuYarat.oyuncuAdı = oyuncuAdı;
  
    destesi = new Array;
    for (let taş = 0; taş < 14; taş++) {
      const taş = deste.pop();
      destesi.push(taş);
    }
    desteSırala(destesi);  // Herkesin deck'ini sıralar. TODO: Sahte okeyi uygun yere koy.
    onlineOyuncular[oyuncu].destesi = destesi;
    // aktifOyuncu.push(oyuncuYarat);
  };

  console.log(onlineOyuncular);
  return [göstergeTaşı, onlineOyuncular];
};


io.on('connection', (socket) => {
  const soketID = socket.id;
  console.log('Kullanıcı bağlandı: ' + soketID);
  io.emit('oyuncular', onlineOyuncular);

  socket.on('isim bilgisi', (isim) => {
    // console.log('Kullanıcı ismi geldi: ' + isim);
    isim = isim.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    const oyuncuIndex = onlineOyuncular.length + 1;
    const oyuncu = { player: oyuncuIndex, id: soketID, adı: isim };
    onlineOyuncular.push(oyuncu);
    console.log(onlineOyuncular);
    io.emit('oyuncular', onlineOyuncular);  //TODO: 4'ten fazla olmamalı!
    // io.emit('client konsol', isim);  // İsim bilgisini herkese gönder.
    if (onlineOyuncular.length === 4) {
      const [ göstergeTaşı, onlineOyuncular ] = oyunBaşlat();  // Multiple return alma işlemi böyle.
      let kendiDestesi = function(oyuncu, index) {
        io.to(oyuncu.id).emit('oyun bilgisi', "Oyun başlıyor...");
        io.to(oyuncu.id).emit('gösterge taşı', göstergeTaşı);
        io.to(oyuncu.id).emit('your board', onlineOyuncular[index].destesi);
        io.to(oyuncu.id).emit('player', { 
          current: currentPlayer, 
          you: onlineOyuncular[index].player
          // yourDeck + Gösterge falan tek seferde buradan gönderilebilir.
        });
        // console.log(index + ' : ' + element + ' - ' + array[index])
      };
      onlineOyuncular.forEach(kendiDestesi);
      //onlineOyuncular.forEach(oyuncu => {
      //  //TODO: Herkese kendi yourBoard'ını gönder.
      //  io.to(oyuncu.id).emit('your board', yourBoard);  // Private msg.
      //});
    };
  });

  socket.on("id0-taş", (element) => {
    console.log(element);
    // var öncekiTaş = {
    //   taşıYollayan: oyuncuSırası,
    //   taş: element.taş
    // };
    // Server-side validation:
    try {
      const oyuncuyuBul = _.where(onlineOyuncular, { id: soketID });  // Returns list!
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