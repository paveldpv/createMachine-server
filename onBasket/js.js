let obj={
   amount: 21,
   date: '03/4/2022',
   id: 'l6tiju8k',
   order: '15!1М63_08_189 ОСЬ.jpg',
   performer: {
     date: '08/02/2022',
     email: 'paveldpv91g@yandex.ru',
     id: 'l5s6ey1e',
     idTelegram: '8088162370',
     keyWords: '',
     name: 'Павел Денискин',
     phone: '89106292550'
   },
   role: 'admin',
   src: 'http://localhost:5000/static//Чертежи станков/Cтанок 16к40/Гитара Каталог/15!1М63_08_189 ОСЬ.jpg',
   units: 'шт',
   urgent: false
 }

 console.log(obj);
 let now = moment().format(`L`)

 console.log(moment(now,"MM/DD/YYYY").diff(obj.date,`days`));