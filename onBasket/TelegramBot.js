
const fs = require('fs')
const bot = require('./../config/telgramBot')
const configDataBase = require('./../config/dbconfig')
const getStikers = require('./../data/stikersBot')


const uniqid = require('uniqid'); 
const moment = require('moment')

const admin = require('firebase-admin');

const db = admin.database()


const ControllerDebts = require('./../Controller/Debts')
const ControllerTelegram =require('./../Controller/Telegram')


module.exports = function (app) {

    app.get(`/bot`, (req, res) => {      
         //сообщения в чат от телеграм бота
      
   })
}


const butonPeopleDebts = (calculatePeople,description=``)=>{
    let debts=[]
    for (const people in calculatePeople) {
        let buttonTelegram = [{text:`${description} деталь к ${people}`,callback_data:people}]
        debts.push(buttonTelegram)
    }
    const debtsPeople = {
        reply_markup:JSON.stringify({
           inline_keyboard:debts
        })
    }
    return debtsPeople
}
const generatePriceProduct = (str=``,idSender,sign=``)=>{

    let price   = /\d{3,}/.test(str) ? str.match(/\d{3,}/)[0] : 0
    let product = str.replace(price," ")
  
     return priceProduct ={
        product : product,
        price   : sign+price,
        id      : uniqid(),
        date    : moment().format('L'),
        senderId: idSender
     }
}

const generateResopnseMessage =(obj)=>{//на основе данных из бд строит сообщения для отрпавки в телегу
    console.log(obj.size);
    let str       = ``
    let totalDebt = 0
    let count     = 0
    for (const key in obj) {        
       let element = obj[key]
       totalDebt+=Number(element.price)
       str += `
       -    деталь : ${element.product} 
       -    цена : ${+element.price} 
       -    дата : ${element.date} 
       ______________________________
       `
       count++
    }
    let messageTotalDebt =``
    if   (totalDebt<0) messageTotalDebt = ` нам должны ${(totalDebt)*(-1)}`
    else messageTotalDebt               = ` наш долг состовляет ${totalDebt}`    
    str+=`общий расчет :`+messageTotalDebt
    
    return count<=10?str:`...более 10ти записей  \n${str.substring(str.length-400)}`
}

bot.setMyCommands([
    {command:`/info` ,description:`Информация о боте`},
    {command:`/adddebts` ,description:`Оплата/Закупка детали/услуги`},
    {command:`/removedebts` ,description:`Продажа детали/услуги`},
    {command:`/requestdebts` ,description:`Посмотреть долги`}   
])


const startBot =  ()=>{        
    
 bot.addListener('message', async msg=>{         
     let idMsg= msg.chat.id  
     console.log(`id chat  = = = = = =  ${idMsg}`);
     
     bot.off('message')
      switch (msg.text) { 
        
             case `/adddebts`     || /adddebts/.test(msg.text)  :
              bot.off('callback_query')   
              db.ref(configDataBase.calculationPeople).once('value',  result=> {         
              peopleDebts = result.val()  // получаем значение все должников из базы данных  
              console.log(peopleDebts);                     
              const debtsPeople = butonPeopleDebts(peopleDebts,`добавить`)  //генерируем из них кнопки для телеграма                        
        
              bot.sendMessage(idMsg,`рабочие контакты`,debtsPeople)
              
              bot.addListener('callback_query', msgC=>{                  
                 let people =  msgC.data   
                 bot.off('callback_query')                   
                 bot.sendMessage(idMsg,`введите значение`)
                 
                  bot.on('message',  msgMS=>{

                    if(!/[/]/.test(msgMS.text)){

                        let debt =  generatePriceProduct(msgMS.text,idMsg)  
                        db.ref(configDataBase.calculationPeople+people).push(debt)
                         .then(res =>{                        
                            bot.sendMessage(idMsg,`OK`) 
                            bot.sendSticker(idMsg,getStikers(`good`))     
                            return
                        })
                    }
                    else{
                        return NaN
                    }
                         
                        
                  })
                    
              })
         })
                 
                 break;
             //=========//
             case `/info`         || /info/.test(msg.text): 
                
              await  bot.sendMessage(idMsg,`здаравствуйте ${msg.from.first_name} ,данный бот призван облегчить способы взаимодействия и расчет с людьми/контрагентами `)
 
                     bot.sendMessage(msg.chat.id,`Напиште мне имя детали и цену (если вы продаете детали цену со знаком минус)значение можно указать в любом формате ("деталь цена"/"цена деталь") я все пойму и запомню (=:) на момент 11/06/2022 воизбежания проблемы лучше указывать одним словом деталь и цифрами цену`)                    
                     break;
             //=========//
             case `/requestdebts` || /requestdebts/.test(msg.text) : 
                    bot.off('callback_query')   
                    db.ref(configDataBase.calculationPeople).once('value',  result=> {   
                    peopleDebts = result.val()  // получаем значение все должников из базы данных                       
                    const debtsPeople = butonPeopleDebts(peopleDebts,`посмотреть`)  //генерируем из них кнопки для телеграма                   
                    bot.sendMessage(idMsg,`выбери контрагента`,debtsPeople) 
                    bot.addListener(`callback_query`, msg=>{

                     let people = msg.data
                     bot.off('callback_query')     
                     db.ref(configDataBase.calculationPeople+people).once('value',async res=>{
                         let debt = await res.val() 
                                     
                         bot.sendMessage(idMsg,generateResopnseMessage(debt))          
                         return                          
                                                 
                     })
                 })
             })
                 break;
             //=========//
             case `/removedebts`  || /removedebts/.test(msg.text)  :
             
                    db.ref(configDataBase.calculationPeople).once('value',  result=> {         
                    peopleDebts = result.val()  // получаем значение все должников из базы данных                       
                    const debtsPeople = butonPeopleDebts(peopleDebts,`добавить`)  //генерируем из них кнопки для телеграма                        
              
                    bot.sendMessage(idMsg,`рабочие контакты`,debtsPeople)
                    
                    bot.addListener('callback_query', msgC=>{                  
                       let people =  msgC.data   
                       bot.off('callback_query')                   
                       bot.sendMessage(idMsg,`введите значение`)
                       
                        bot.on('message',  msgMS=>{
                            if(!/[/]/.test(msgMS.text)){

                                let debt =  generatePriceProduct(msgMS.text,idMsg,`-`)  
                               console.log( debt);
                                db.ref(configDataBase.calculationPeople+people).push(debt)
                                 .then(res =>{                        
                                    bot.sendMessage(idMsg,`OK`) 
                                    bot.sendSticker(idMsg,getStikers(`good`))     
                                    return
                                })
                            }
                            else{
                                return NaN
                            }
                               
                              
                        })
                          
                    })
               })
                       
                       break;
             //=========//
             default:
                 break;
         }
        
         startBot()
   
        
       
        
    })   
    
}


    startBot()





    

