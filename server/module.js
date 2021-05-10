const _ = require('underscore');

function oyunBaşlat(onlineListe) {
  sayılar = ["1","2","3","4","5","6","7","8","9","10","11","12","13"];
  renkler = ["Kırmızı", "Sarı", "Siyah", "Mavi"];
  deste = new Array;
  
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
  
  var deste = _.shuffle(deste);  // İlk karıştırma.
  
  // Sahte okey, okey seçilmesin diye daha sonra push edilecek.
  // İlk taşı Okey olarak seç. Eşi otomatik seçilir.
  const okeytaşı = deste[0];
  okeytaşı.isOkey = true;
  console.log(okeytaşı);

  sahteOkeyeDeğerVerici(sahte);
  deste.push(sahte);
  deste.push(sahte);
  
  for (let i = 0; i < deste.length; i++) {
    const taş = deste[i];
    // TODO: Okey = 1 ise Göstergeyi 13'e yönlendir!
    if (okeytaşı.sayı !== "1") {
      if (taş.renk === okeytaşı.renk && Number(taş.sayı) === Number(okeytaşı.sayı) - 1) {
        var göstergeTaşı = taş;
        göstergeTaşı.isGösterge = true;
        console.log(göstergeTaşı);
        break
      }
    } else {
      if (taş.renk === okeytaşı.renk && taş.sayı === "13") {
        var göstergeTaşı = taş;  //Test: Buna dışardan erişmeyi dene. Works!
        göstergeTaşı.isGösterge = true;
        console.log(göstergeTaşı);
        break
      }
    }
  }
  var deste = _.shuffle(deste); // Son karıştırma. Sahte okey eklendikten sonra.
  
  // Fonksiyonları ayrı .js'e al.
  function desteSırala(deste) {
    deste.sort((a, b) => {
      return a.sayı - b.sayı;
    });
  };

  for (let oyuncu = 0; oyuncu < onlineListe.length; oyuncu++) {
    destesi = new Array;
    // İlk başlayan oyuncuya ekstra 1 taş daha ver.
    if (onlineListe[oyuncu].isFirstPlayer) {
      const taş = deste.pop();
      destesi.push(taş);
    };
    for (let taş = 0; taş < 14; taş++) {
      const taş = deste.pop();
      destesi.push(taş);
    };
    desteSırala(destesi);  // Herkesin deck'ini sıralar.
    onlineListe[oyuncu].destesi = destesi;
  };
  
  console.log("Ortadaki taş sayısı: " + deste.length); //!TODO: İşte bu soketle gönderilecek.
  return [göstergeTaşı, onlineListe, deste];
};

function oyuncuBul(soketID, onlineListe) {
  return _.where(onlineListe, { id: soketID });  // Returns list!
};

module.exports = {
  oyunBaşlat,
  oyuncuBul,
};