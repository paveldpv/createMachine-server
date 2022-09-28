const stikers ={
   good:[
      `https://tlgrm.ru/_/stickers/320/625/3206250e-cee1-4819-9061-668f394a9df6/192/13.webp`,
      `https://tlgrm.ru/_/stickers/320/625/3206250e-cee1-4819-9061-668f394a9df6/192/27.webp`,
      `https://tlgrm.ru/_/stickers/320/625/3206250e-cee1-4819-9061-668f394a9df6/192/35.webp`,
      `https://tlgrm.ru/_/stickers/320/625/3206250e-cee1-4819-9061-668f394a9df6/192/25.webp`,
      `https://cdn.tlgrm.app/stickers/9df/619/9df6199a-ff6a-338d-9f74-625b0a647045/thumb128.webp`
   ],
   bad:[
      `https://tlgrm.ru/_/stickers/320/625/3206250e-cee1-4819-9061-668f394a9df6/192/26.webp`,
      `https://tlgrm.ru/_/stickers/320/625/3206250e-cee1-4819-9061-668f394a9df6/192/31.webp`,
      `https://tlgrm.ru/_/stickers/320/625/3206250e-cee1-4819-9061-668f394a9df6/192/36.webp`

   ],
   not:``
}

const randomInteger=(min, max)=> { 
   let rand = min - 0.5 + Math.random() * (max - min + 1); 
   return Math.round(rand); }

const getStikers =(str)=>{
   switch (str) {
      case `good`:
         return stikers.good[randomInteger(0,stikers.good.length)]
         break;
       case `bad`:
         return stikers.bad[randomInteger(0,stikers.bad.length)]
         break;
   
      default:
         return '(=:'
         break;
   }
}

module.exports = getStikers
