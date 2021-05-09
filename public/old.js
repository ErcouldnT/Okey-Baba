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
