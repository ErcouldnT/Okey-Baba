var socket = io();

// Html elements
var form = document.getElementById('form');
var input = document.getElementById('input');
var isimDivi = document.querySelector('.isim-al');
var onlineListe = document.querySelector('.onlineliste');
var oyuncuListesi = document.querySelector('.oyunculistesi');
var oyunArea = document.querySelector('.oyunarea');
var oyuncuBekleniyor = document.querySelector('.oyuncubekleniyor');
var infoMessage = document.querySelector('.info-message');
var yeniTaşÇek = document.querySelector('.yeni');
const id1 = document.getElementById("id-1");
const id2 = document.getElementById("id-2");
const id3 = document.getElementById("id-3");
const id4 = document.getElementById("id-4");
var orta_taş_yeri = document.querySelector('.orta-taş-yeri');

// Variables
let taşSimge = "❤";
let sahteOkeySimge = "♣";
let taşÇekmeHakkı = false;
let ilkBaşlayan = false;
let taşAldıMı = false;
let list_of_gamers = [];

// Event listeners
form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('isim bilgisi', input.value);  // Server'a gönder.
    // input.value = '';
    isimDivi.remove();
  };
});

// Functions
function taşKaymaÖzelliğiVer(taş, element) {
  // taş: 'div', element: '{renk, sayı}'
  taş.setAttribute('draggable', true);
  taş.addEventListener('dragstart', dragStart);
  taş.addEventListener('drag', drag);
  taş.addEventListener('dragend', dragEnd);
  //taş.addEventListener("dblclick", çiftTıkTaşYolla);
  if (element) {
    taş.addEventListener('click', e => {
      console.log(element);
    });
  };
};

function taşCSStoOBJECT(div) {
  // taş = {renk: "Mavi", sayı: "1"}
  let taş = {};
  // renk class'tan + sayı textContent (regex) + validate.
  const isSarı = div.classList.contains('sarı');
  const isKırmızı = div.classList.contains('kırmızı');
  const isSiyah = div.classList.contains('siyah');
  const isMavi = div.classList.contains('mavi');
  if (isSarı) {
    taş.renk = "Sarı";
  } else if (isKırmızı) {
    taş.renk = "Kırmızı";
  } else if (isSiyah) {
    taş.renk = "Siyah";
  } else if (isMavi) {
    taş.renk = "Mavi";
  };
  if (div.textContent.match(/\d/g)) {
    taş.sayı = div.textContent.match(/\d/g).join(""); //!Bug: Sahte okey.
  } else {
    taş.renk = okey.renk;
    taş.sayı = okey.sayı;
    taş.isSahteOkey = true;
  };
  return taş;
};

function oyuncudanGelenTaşıAl() {
  var gelen_taş = document.querySelectorAll(".gelen-taş-yeri > div");
  gelen_taş.forEach(taş => {
    let element = taşCSStoOBJECT(taş);
    taşKaymaÖzelliğiVer(taş, element);
  });
};

// Sol taraftaki oyuncunın attığı taşı alma işlemi:
//id4.addEventListener("dblclick", çiftTıkSolTaraftanTaşAl);

function çiftTıkSolTaraftanTaşAl(e) {
  e.preventDefault();
  if (you === currentPlayer && taşÇekmeHakkı === true) {
    console.log("Taş çekildi: " + id4.textContent);
    // !TODO: Taş çekme işleminin gerçekleşmesini sağla.
    //id4 div'inin içeriğini kes.
    //if Istaka'daki first child div'i boşsa onun içeriğine çekilen taşı ekle.
    //Değilse, son child'a ekle 28.th-child olması lazım.
    //class ları id4 div'inden kes-al.
    //TextContent'i de kes-al.
  
    // Tekrar taş çekmesini engelle:
    taşÇekmeHakkı = false;
    taşAldıMı = true;
  };
};

// Ortadan yeni taş alma işlemi:
//yeniTaşÇek.addEventListener("dblclick", çiftTıkOrtaYeniTaşAl);

function çiftTıkOrtaYeniTaşAl(e) {
  e.preventDefault();
  if (you === currentPlayer && taşÇekmeHakkı === true) {
    console.log("Ortadan yeni taş çekildi."); // 'socket to deste'den taş iste.
    // Socket'ten gelen taşı oyuncunun gerçek destesine eklemeyi unutma!
    // !TODO: Some logic.
  
    // Tekrar taş çekmesini engelle:
    taşÇekmeHakkı = false;
    taşAldıMı = true;
  };
};

function taşYarat(taş, id1) {  // Taş'ın bağlı bulunduğu parent div for atılan taşlar.
  var yollanan_taş = document.createElement("div");
  var taş_ismi = document.createTextNode(taş.sayı);
  yollanan_taş.appendChild(taş_ismi);
  id1.innerHTML = "";  // Sadece tek bir taş gösterir.
  id1.appendChild(yollanan_taş);
  return yollanan_taş;
};

function dragStart(e) {
  //console.log(e.target);
  e.target.setAttribute('id', 'taşıyorum');
  e.dataTransfer.setData('text/plain', e.target.id);
  setTimeout(() => {
    e.target.classList.add('yoket');
  }, 0);
};
function drag(e) {
  e.preventDefault();
  //console.log('taş sürükleniyor.');
};
function dragEnd(e) {
  e.preventDefault();
  e.target.removeAttribute('id');
  e.target.classList.remove('yoket');
};

function dragEnter(e) {
  e.preventDefault();
  //e.target.classList.add('drag-over');
};
function dragOver(e) {
  e.preventDefault();
  //e.target.classList.add('drag-over');
};
function dragLeave(e) {
  e.preventDefault();
  //e.target.classList.remove('drag-over');
};
function drop(e) {
  e.preventDefault();
  //e.target.classList.remove('drag-over');
  const yeniyer = document.getElementById(e.target.id);
  //console.log(yeniyer.firstChild); !BUG: Konsol error.
  if (!yeniyer.firstChild) {
    const id = e.dataTransfer.getData('text/plain');
    var sürüklenen = document.getElementById(id);
    if (sürüklenen.classList.contains('yeni')) {
      // Ortadan yeni taş çek:
      if (you === currentPlayer && taşÇekmeHakkı === true) {
        console.log("Ortadan yeni taş çekildi.");
        // Socket'ten gelen taşı oyuncunun gerçek destesine eklemeyi unutma!
        // '{you, sürüklenen taş as CSStoObject}'
        socket.emit('yeni taş iste', {
          player: you  // Gereksiz...
        });
        e.target.appendChild(sürüklenen);
        // Tekrar taş çekmesini engelle:
        taşÇekmeHakkı = false;
        taşAldıMı = true;
      };
    } else if (sürüklenen.parentElement.classList.contains('gelen-taş-yeri')) {
      // Sol taraftaki oyuncunun attığı taşı çek:
      if (you === currentPlayer && taşÇekmeHakkı === true) {
        // !TODO!: Diğer oyuncuların div'lerinden taşı sil ve atılan bir önceki taşı göster.
        e.target.appendChild(sürüklenen);
        sağTıklaTaşıGizle(sürüklenen);
        // Tek değişkene indir.
          taşÇekmeHakkı = false;
          taşAldıMı = true; // Bunlar birbirinin tersi. İlk oyuncu taş almış sayılsın.
          socket.emit('taş çeken oyuncu', { player: you });
        };
      //var taş_boardu = document.querySelectorAll(".board .taş"); 
      // Board'ı son haline güncelle.
    } else if (sürüklenen.classList.contains('taş')
    // Board'da taş gezdir:
    && !sürüklenen.classList.contains('yeni')
    && !sürüklenen.classList.contains('gelen-taş-yeri')) {
      e.target.appendChild(sürüklenen);
      //sürüklenen.classList.remove('yoket');  // Drag event'i bittiğinde yapıyor zaten.
    };
  };
  //sürüklenen.removeAttribute('id');
};

function taşYollaMekaniği() {
  const giden_taş_yeri = document.querySelector('.giden-taş-yeri');
  giden_taş_yeri.addEventListener('dragenter', dragEnter);
  giden_taş_yeri.addEventListener('dragover', dragOver);
  giden_taş_yeri.addEventListener('dragleave', dragLeave);
  giden_taş_yeri.addEventListener('drop', drop);
  function dragEnter(e) {
    e.preventDefault();
    //e.target.classList.add('drag-over');
  };
  function dragOver(e) {
    e.preventDefault();
    //e.target.classList.add('drag-over');
  };
  function dragLeave(e) {
    e.preventDefault();
    //e.target.classList.remove('drag-over');
  };
  function drop(e) {
    e.preventDefault();
    //e.target.classList.remove('drag-over');
    const id = e.dataTransfer.getData('text/plain');
    var gönderilen = document.getElementById(id);
    let taş = taşCSStoOBJECT(gönderilen);

    if (ilkBaşlayan || you === currentPlayer && taşAldıMı && !gönderilen.classList.contains('yeni')) {
      taşAldıMı = false;
      ilkBaşlayan = false;
      // Client-side validation buraya eklenebilir...
      socket.emit("yere taş at", {
        player: you,
        taş: taş
      });
      gönderilen.remove();
    };

    // Bunların yerine taşı server'a gönder:
    // gönderilen.removeAttribute('id');
    // gönderilen.classList.remove('yoket');
    // gönderilen.removeAttribute('draggable');
    // e.target.appendChild(gönderilen);
    // console.log(gönderilen);

    // socket.emit("yere taş at", {
    //   player: you,
    //   taş: element
    // });
  };
};

function çiftTıkTaşYolla(event) {
  event.preventDefault();
  // Sıra sendeyse ve Yeni taş aldıysan yollayabilirsin. YA DA İlk oyuncu isen!
  // ve bir de ilkBaşlayan yollayabilir.
  if (ilkBaşlayan || you === currentPlayer && taşAldıMı) {
    //!BUG: Player-1 taş çekmeden taş yolluyor.
    taşAldıMı = false;
    ilkBaşlayan = false;  // Bug solved.
    // Client-side validation:
    const isContain = !!yourBoard.find(taş => {  
      return taş === element;
    });
    if (isContain) {  // underscore kullanılabilirdi.
      //id0_list.push(element); Server'da yap bunu.
      yourBoard = yourBoard.filter(taş => taş !== element);
      
      //id0.textContent = _.last(id0_list).sayı;  // = element.sayı;
      // TODO: Uygun rengi de alsın. Css-sınıfı-seçiciyi function'a çevir, buraya ekle.

      socket.emit("yere taş at", {
        player: you,
        taş: element
      });
      // !TODO!: Yukarıdaki işlemleri Server'da yaz. id0'ın ne olacağına Server karar versin.
      //console.log(id0_list);
    };

    // LTODO: İçeriği temizlemenin başka yolunu bul.
    // taş.remove(); Child olduğu zaman works.
    // Geçici çözüm:
    taş.className = "";
    taş.textContent = "";
    taş.innerHTML = "";
    // console.log(div);
    // div.classList.add("giden");
  } else if (currentPlayer && you === currentPlayer && !taşAldıMı) {
    alert("Taş almayı unuttun!");
  };
};

function sağTıklaTaşıGizle(taş) {
  taş.addEventListener("contextmenu", event => {
    event.preventDefault();
    taş.classList.toggle("gizle");
  });
};

function taşRenkÇevirici(taş, divtaş) {  // Spesifik olarak tek bir taşın div'i.
  divtaş.className = "taş";
  divtaş.textContent = divtaş.textContent + taşSimge;
  if (taş.isSahteOkey) {
    divtaş.textContent = sahteOkeySimge;
    divtaş.classList.add("yeşil");  // Farklı renkte Sahte okey gelmesini önler.
  };
  if (taş.renk === "Kırmızı") {
    divtaş.classList.add("kırmızı");
  } else if (taş.renk === "Sarı") {
    divtaş.classList.add("sarı");
  } else if (taş.renk === "Siyah") {
    divtaş.classList.add("siyah");
  } else if (taş.renk === "Mavi") {
    divtaş.classList.add("mavi");
  };
};

// Sağ tık blocker.
document.addEventListener('contextmenu', event => event.preventDefault());

// Sockets
socket.on('taş çeken oyuncu', (player) => {
  console.log("Taş çeken oyuncu: " + player);
  //const yer = document.getElementById(`id${player}`);
  if (player === 1) {
    if (you === 2) {
      id3.innerHTML = "";
    } else if (you === 3) {
      id2.innerHTML = "";
    } else if (you === 4) {
      id1.innerHTML = "";
    };
  } else if (player === 2) {
    if (you === 1) {
      id1.innerHTML = "";
    } else if (you === 3) {
      id3.innerHTML = "";
    } else if (you === 4) {
      id2.innerHTML = "";
    };
  } else if (player === 3) {
    if (you === 1) {
      id2.innerHTML = "";
    } else if (you === 2) {
      id1.innerHTML = "";
    } else if (you === 4) {
      id3.innerHTML = "";
    };
  } else if (player === 4) {
    if (you === 1) {
      id3.innerHTML = "";
    } else if (you === 2) {
      id2.innerHTML = "";
    } else if (you === 3) {
      id1.innerHTML = "";
    };
  };
  // !TODO: Boş kalmasın, bir önceki atılan taşı göstersin.
});

socket.on('kalan taş sayısı', (sayı) => {
  // "Taş sayısı bilgisi gelince" yeni orta boş taş oluşturur.
  console.log("Ortadaki yeni taş sayısı: " + sayı);
  //let yeniTaşÇek = document.querySelector('.yeni');
  // Tekrar taş çekme yerine boş taş koy:
  const boş_taş = document.createElement('div');
  boş_taş.classList.add('yeni');
  boş_taş.classList.add('taş');
  orta_taş_yeri.innerHTML = "";
  orta_taş_yeri.appendChild(boş_taş);
  taşKaymaÖzelliğiVer(boş_taş);
  boş_taş.textContent = sayı;
  //boş_taş.style.color = 'purple'; // !BUG: Board'a gelen taşın da rengi değişiyor.
});

socket.on('yeni taş', (yenitaş) => {
  //console.log(yenitaş);
  let yeniTaşÇek = document.querySelector('.yeni');  // Her yeni taşta baştan seçilmeli!
  yeniTaşÇek.innerHTML = "";
  var taş_ismi = document.createTextNode(yenitaş.sayı);
  yeniTaşÇek.appendChild(taş_ismi);
  taşRenkÇevirici(yenitaş, yeniTaşÇek);
  // Board güncelleme fonk. ekleyerek taşları güncelle.
  // Sağ tık ile taş gizle.
  // Taşları kaydır.
  taşKaymaÖzelliğiVer(yeniTaşÇek, yenitaş);
  sağTıklaTaşıGizle(yeniTaşÇek);
  // let yeniTaşÇek = boş_taş; kullanılabilir...
});

socket.on('player', function(player) {
  // Oyun başladığı anda tetiklenir.
  currentPlayer = player.current;
  you = player.you;
  ilkBaşlayan = player.ilkBaşlar;
  okey = player.okeytaşı;
  if (ilkBaşlayan) {
    infoMessage.textContent = "Oyuna sen başlıyorsun."
    // Sadece taş transferini kontrol eden bir socket açılabilir. 'Deste to oyuncu' arası.
  } else {
    infoMessage.textContent = list_of_gamers[0].adı + " isimli oyuncu bekleniyor.";
  };
  console.log("current: " + currentPlayer + ", " + "you: " + you);
});

socket.on('current player', function(info) {
  // Bu socket taş atıldığında tetiklenir.
  currentPlayer = info.current;
  taşÇekmeHakkı = info.taşHakkı;
  console.log("current: " + currentPlayer + ", " + "you: " + you);
  if (currentPlayer === you) {
    infoMessage.textContent = "Sıra sende."
  } else {
    infoMessage.textContent = list_of_gamers[currentPlayer - 1].adı + " isimli oyuncu bekleniyor.";
  };
});

socket.on('masa taşı', function(taşBilgisi) {
  // Biri taş yolladığında tetiklenir.
  taşıYollayan = taşBilgisi.taşıYollayan;
  taş = taşBilgisi.taş;
  console.log(taşıYollayan + " nolu oyuncu tarafından " + taş.renk + " " + taş.sayı + " yollandı.");
  if (taşıYollayan === you) {
    var yollanan_taş = taşYarat(taş, id1);
    taşRenkÇevirici(taş, yollanan_taş);
  } else if (
    (you === 1 && taşıYollayan === 2) || 
    (you === 2 && taşıYollayan === 3) ||
    (you === 3 && taşıYollayan === 4) ||
    (you === 4 && taşıYollayan === 1)) {
    var yollanan_taş = taşYarat(taş, id2);
    taşRenkÇevirici(taş, yollanan_taş);
  } else if (
    (you === 1 && taşıYollayan === 3) ||
    (you === 2 && taşıYollayan === 4) ||
    (you === 3 && taşıYollayan === 1) ||
    (you === 4 && taşıYollayan === 2)) {
    var yollanan_taş = taşYarat(taş, id3);
    taşRenkÇevirici(taş, yollanan_taş);
  } else if (
    (you === 1 && taşıYollayan === 4) ||
    (you === 2 && taşıYollayan === 1) ||
    (you === 3 && taşıYollayan === 2) ||
    (you === 4 && taşıYollayan === 3)) {
    var yollanan_taş = taşYarat(taş, id4);
    taşRenkÇevirici(taş, yollanan_taş);
  };
  oyuncudanGelenTaşıAl();  //Bug solved: Taş oluştuktan sonra.
});

socket.on('client konsol', function(msg) {
  // var item = document.createElement('li');
  // item.textContent = msg;
  // messages.appendChild(item);
  // window.scrollTo(0, document.body.scrollHeight);
  console.log(msg);
});

socket.on('oyuncular', function(msg) {
  list_of_gamers = msg;
  if (msg.length === 0) {
    onlineListe.classList.add("yoket");
  } else {
    onlineListe.classList.remove("yoket");
  };
  oyuncuListesi.innerHTML = '';  // REPLACE!
  msg.forEach(element => {
    if (msg.length >= 4) {
      oyuncuBekleniyor.textContent = `Server dolu! (${msg.length}/4)`
      oyuncuListesi.style.display = 'none';
    } else {
      oyuncuBekleniyor.textContent = `Online Oyuncular: (${msg.length}/4)`
    };
    // console.log(element.adı);
    const node = document.createElement("div");
    var textnode = document.createTextNode(element.adı);
    node.appendChild(textnode);
    oyuncuListesi.appendChild(node);
  });
});

socket.on('oyun bilgisi', function(bilgi) {
  console.log(bilgi);  // Oyun başlıyor bilgisi buradan geliyor.
  oyunArea.classList.remove("yoket")
  onlineListe.style.display = 'none';
});

socket.on('gösterge taşı', function(taş) {
  console.log(taş);
  const göstergeTaşı = taş;
  // Okey taşı da gelsin, lazım olacak.
  // TODO: Desteden göstergeyi kes!?
  const divg = document.getElementById("gösterge");
  // First, clear previous classnames:
  //divg.className = "taş";
  divg.textContent = `${göstergeTaşı.sayı}`;
  taşRenkÇevirici(göstergeTaşı, divg);
});

socket.on('your board', function(yours) {
  console.log(yours);
  let yourBoard = yours;
  const board = document.querySelector(".board");
  // First, clear previous classnames:
  board.innerHTML = ""; // !BUG: Board restart edilirse sıçıyor.
  let width = 14;
  let height = 2;
  // let squares = [];
  
  function createBoard() {
    for (let i = 0; i < width*height; i++) {
      const square = document.createElement("div");
      square.setAttribute('id', i + 1);
      square.addEventListener('dragenter', dragEnter);
      square.addEventListener('dragover', dragOver);
      square.addEventListener('dragleave', dragLeave);
      square.addEventListener('drop', drop);
      board.appendChild(square);
    };
  };

  function addElement() {
    for (let i = 0; i < yourBoard.length; i++) {
      const element = yourBoard[i];
      const board = document.getElementById(`${i + 1}`);
      const taş = document.createElement('div');
      taş.textContent = `${element.sayı}`;
      taşRenkÇevirici(element, taş);
      taş.classList.add("taş");
      sağTıklaTaşıGizle(taş);
      taşKaymaÖzelliğiVer(taş, element);
      board.appendChild(taş);
    };
  };
  
  createBoard();
  addElement();
  taşYollaMekaniği();
  taşKaymaÖzelliğiVer(yeniTaşÇek);
});
// !TODO!: Bağlantı koparsa "connection error" yazdır.