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

// Variables
let taşSimge = "❤";
let sahteOkeySimge = "♣";
let taşÇekmeHakkı = false;
let ilkBaşlayan = false;
let taşAldıMı = false;

// Event listeners
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

// Functions
function oyuncudanGelenTaşıAl() {
  // Sol taraftan gelen taşı alma işlemi: id4
  // Sağ tarafta taş yollama işlemi: id1
  //Array döndürür, board'daki bütün taşları içeren....Zaten var bu, yourBoard.
  //var taş_boardu = document.querySelectorAll(".board .taş"); // Bunu en sona at!
  var gelen_taş = document.querySelectorAll(".gelen-taş-yeri > div");
  //var giden_taş = document.querySelectorAll(".giden-taş-yeri div");
  gelen_taş.forEach(taş => {
    taş.setAttribute('draggable', true);
    // console.log(element);
    taş.addEventListener('dragstart', dragStart);
    // taş.addEventListener('drag', drag);
    // taş.addEventListener('dragend', dragEnd); // Taşın yeri değişmediyse geri koy.

    function dragStart(e) {
      var taşınan_taş = e.target;
      setTimeout(() => {
        e.target.style.display = 'none';
      }, 0);
    };
  });

  const taş_yerleri = document.querySelectorAll('.board > div');
  taş_yerleri.forEach(taş_yeri => {
    taş_yeri.addEventListener('dragenter', dragEnter)
    taş_yeri.addEventListener('dragover', dragOver);
    taş_yeri.addEventListener('dragleave', dragLeave);
    taş_yeri.addEventListener('drop', drop);
  });

  function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
  }

  function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
  }

  function dragLeave(e) {
    e.target.classList.remove('drag-over');
  }

  function drop(e) {
    e.target.classList.remove('drag-over');
    // const id = e.dataTransfer.getData('text/plain');
    // const draggable = document.getElementById(id);
    var draggable = taşınan_taş;
    e.target.appendChild(draggable);
    draggable.style.display = 'block';
  }

  // elem.removeAttribute('dragable');
  // elem.addEventListener('dragstart', ev => {
  //   // code here.
  // }, false);
};

function boarddaTaşGezdir() {
  const taşlar = document.querySelectorAll('.board > div > div');
  taşlar.forEach(taş => {
    taş.setAttribute('draggable', true);
    taş.addEventListener('dragstart', dragStart);
    taş.addEventListener('drag', drag);
    taş.addEventListener('dragend', dragEnd); // Taşın yeri değişmediyse geri koy.
    //taş.remove();
  });
  function dragStart(e) {
    console.log(e.target);
    e.target.setAttribute('id', 'taşıyorum');
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
      e.target.classList.add('yoket');
    }, 0);

  };
  function drag(e) {
    e.preventDefault();
    console.log('taş sürükleniyor.');
  };

  function dragEnd(e) {
    e.preventDefault();
    e.target.removeAttribute('id');
    e.target.classList.remove('yoket');
  };

  // TAŞ YERLERİ
  const taş_yerleri = document.querySelectorAll('.board > div');
  taş_yerleri.forEach(taş_yeri => {
    taş_yeri.addEventListener('dragenter', dragEnter);
    taş_yeri.addEventListener('dragover', dragOver);
    taş_yeri.addEventListener('dragleave', dragLeave);
    taş_yeri.addEventListener('drop', drop);
  });

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
    //console.log(yeniyer.firstChild);
    if (!yeniyer.firstChild) {
      const id = e.dataTransfer.getData('text/plain');
      var sürüklenen = document.getElementById(id);
      e.target.appendChild(sürüklenen);
      //sürüklenen.classList.remove('yoket');  // Drag event'i bittiğinde yapıyor zaten.
    };
    sürüklenen.removeAttribute('id');
  };
};

function taşYarat(taş, id1) {  // Taş'ın bağlı bulunduğu parent div.
  var yollanan_taş = document.createElement("div");
  var taş_ismi = document.createTextNode(taş.sayı);
  yollanan_taş.appendChild(taş_ismi);
  id1.appendChild(yollanan_taş);
  return yollanan_taş;
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

// Sockets
socket.on('player', function(player) {
  // Oyun başladığı anda tetiklenir.
  currentPlayer = player.current;
  you = player.you;
  ilkBaşlayan = player.ilkBaşlar;
  if (ilkBaşlayan) {
    infoMessage.textContent = "Oyuna sen başlıyorsun."
    // Sadece taş transferini kontrol eden bir socket açılabilir. 'Deste to oyuncu' arası.
  } else {
    infoMessage.textContent = "1 nolu oyuncu bekleniyor."
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
    infoMessage.textContent = `${currentPlayer} nolu oyuncu bekleniyor.`
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
  // oyuncudanGelenTaşıAl();  //Bug solved: Taş oluştuktan sonra.
});

socket.on('client konsol', function(msg) {
  // var item = document.createElement('li');
  // item.textContent = msg;
  // messages.appendChild(item);
  // window.scrollTo(0, document.body.scrollHeight);
  console.log(msg);
});

socket.on('oyuncular', function(msg) {
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
    }
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
  // TODO: Desteden göstergeyi kes!
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
  board.innerHTML = "";
  let width = 14;
  let height = 2;
  // let squares = [];
  
  function createBoard() {
    for (let i = 0; i < width*height; i++) {
      const square = document.createElement("div");
      square.setAttribute('id', i + 1); // div id'leri 1'den başlasın.
      // square.classList.add(yourBoard[i])
      board.appendChild(square);
      // squares.push(square);
    };
  };

  function addElement() {
    for (let i = 0; i < yourBoard.length; i++) {
      const element = yourBoard[i];
  
      const div = document.getElementById(`${i + 1}`);
      // console.log(div);
      const taş = document.createElement('div');
      taş.textContent = `${element.sayı}`;
      // const text = document.createTextNode(`${element.sayı}`);
      // div.appendChild(text);
  
      // Taşları tanı!
      // div.addEventListener("click", event => {
      //   event.preventDefault();
      //   // const değer = event.target.textContent;
      //   console.log(element);
      // });

      function çiftTıkTaşYolla(event) {
        event.preventDefault();
        // Sıra sendeyse ve Yeni taş aldıysan yollayabilirsin. YA DA İlk oyuncu isen!
        // ilkBaşlayan
        if (ilkBaşlayan || you === currentPlayer && taşAldıMı) {
          //!BUG: Player-1 taş çekmeden taş yolluyor.
          taşAldıMı = false;
          ilkBaşlayan = false;  // Bug solved.
          // Client-side validation:
          const isContain = !!yourBoard.find(taş => {  
            return taş === element;
          });
          if (isContain) {  // underscore kullanılabilirdi.
            //id0_list.push(element);
            // yourBoard'dan elemanı sil. filter olabilir.
            yourBoard = yourBoard.filter(taş => taş !== element);
            //yourBoard = sonDeste;
            
            //id0.textContent = _.last(id0_list).sayı;  // = element.sayı;
            // TODO: Uygun rengi de alsın. Css-sınıfı-seçiciyi function'a çevir, buraya ekle.

            socket.emit("id0-taş", {
              player: you,
              taş: element
            });
            // !TODO!: Yukarıdaki işlemleri Server'da yaz. id0'ın ne olacağına Server karar versin.
            //console.log(id0_list);
          };

          // LTODO: İçeriği temizlemenin başka yolunu bul.
          taş.className = "";
          taş.textContent = "";
          taş.innerHTML = "";
          // console.log(div);
          // div.classList.add("giden");
        } else if (currentPlayer && you === currentPlayer && !taşAldıMı) {
          alert("Taş almayı unuttun!");
        };
      };

      // Çift tıklayınca taşı yolla.
      //taş.addEventListener("dblclick", çiftTıkTaşYolla);

      taşRenkÇevirici(element, taş);
  
      taş.classList.add("taş");
      // const board = document.getElementById("board");
      // board.appendChild(div);
  
      taş.addEventListener("contextmenu", event => {
        // Sağ tıklayınca taş çevirme özelliği:
        event.preventDefault();
        // const değer = event.target.textContent;
        // console.log(değer);
        taş.classList.toggle("gizle");
        // taşıÇevir();
      });

      div.appendChild(taş);
  
      // TODO: DOUBLE CLICK İLE TAŞI FIRLAT.

      // console.log(element);
    };
  };
  
  createBoard();
  addElement();
  boarddaTaşGezdir();
  //TODO: Bağlantı koparsa "connection error" yazdır.
  
  // 1. Elinde hiç okey yok
  // 2. 1 Okey var.
  // 3. 2 Okey ile bitiyor.
  // 
  function bittiMi(oyuncununEli) {
    let aynıPerler = new Array;
    let ardışıkPerler = new Array;
  
    function kaçOkeyVar(oyuncununEli) {
      const tekOkey = _.where(oyuncununEli, { isOkey: true });
      if (tekOkey.length === 1) {
        console.log("Elinizde 1 adet okey mevcut.");
        return 1;
      } else if (tekOkey.length === 2) {
        console.log("Elinizde 2 adet okey mevcut.");
        return 2;
      } else {
        console.log("Elde okey yok.");
        return 0;
      };
    };
    
    const okeySayısı = kaçOkeyVar(oyuncununEli);
    console.log(okeySayısı);
    
    if (okeySayısı === 0) {
      const grup = _.groupBy(oyuncununEli, function(taş){ return taş.sayı; });
      // console.log(grup);
      
      for (const i in grup) {
        if (Object.hasOwnProperty.call(grup, i)) {
          const element = grup[i];
          const unique = [ ...new Set(element) ]  // Birebir aynı taştan 2 adet olmamalı?????? Test it.
          if (unique.length > 2) {
            // console.log(unique);
            // Bu taşları listeden sil.
            unique.forEach(element => {
              aynıPerler.push(element);
            });
          };
        };
      };
    };
    
    console.log(aynıPerler);
    //const sarılar = _.where(oyuncununEli, {renk: "Sarı"});
    //const siyahlar = _.where(oyuncununEli, {renk: "Siyah"});
    //const kırmızılar = _.where(oyuncununEli, {renk: "Kırmızı"});
    //const maviler = _.where(oyuncununEli, {renk: "Mavi"});
    //console.log(sarılar);
    //console.log(siyahlar);
    //console.log(kırmızılar);
    //console.log(maviler);
  };
  // const yedekBoardForTest = yourBoard;
  bittiMi(yourBoard);
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('isim bilgisi', input.value);  // Server'a gönder.
    // input.value = '';
    isimDivi.remove();
  };
});
// Sağ tık blocker.
document.addEventListener('contextmenu', event => event.preventDefault());

var board = document.querySelector(".board")
// console.log(board);
// new Sortable(ıstakadaKaydır, {
  //   //animation: 150,
  //   //swapThreshold: 0.5,
  //   //swap: true,
  //   animation: 150,
  //   swapThreshold: 0.5,
  //   swap: true, // To disable sorting: set sort to false
  //   // draggable: ".taş"
  //   // ghostClass: "görünmez"
  //   // onEnd: function (evt) {
    //   //   if (evt.to !== evt.from ) {
      //   //     evt.item.classList.add("giden");
      //   //   };
      //   // }
      // });
      // new Sortable(id0, {
        //   group: 'shared',
        //   animation: 150,
        //   sort: false,
        //   // draggable: ".taş"
        // });
        
