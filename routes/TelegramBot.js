const bot = require('./../config/telgramBot')

const uniqid = require('uniqid'); 
const moment = require('moment')

const ControllerDebts = require('./../Controller/Debts')
const ControllerTelegram =require('./../Controller/Telegram')

const getStikers = require('./../data/stikersBot')

module.exports = function (app) {

    app.get(`/bot`, (req, res) => {      
         //сообщения в чат от телеграм бота
      
   })
}




const listDebtorsOnTelegram =(debtors=[],description=``)=>{
    let resultList=[]
    debtors.forEach(debtor => {
        let buttonTelegram = [{text:`${description} деталь к ${debtor}`,callback_data:debtor}]
        resultList.push(buttonTelegram)
    });
    const list={
        reply_markup:JSON.stringify({
            inline_keyboard:resultList
         })
    }
    return list
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
    // console.log(obj);
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
              let addDebtorsName=  await ControllerDebts.getDebtorsName();
              if(addDebtorsName.error)bot.sendMessage(idMsg,`DataBase error,try later`)
              let addListDebtors = listDebtorsOnTelegram(addDebtorsName.data,`ДОБАВИТЬ К : `)
              await bot.sendMessage(idMsg,'Выберете Контрагента из списка',addListDebtors)
              bot.addListener('callback_query',addRes=>{
                let debtor = addRes.data
                bot.off('callback_query')  
                bot.sendMessage(idMsg,`введите значение`)
                bot.on('message',async(debt)=>{
                    if(/[/]/.test(debt.text))return NaN
                    let dataDebts = generatePriceProduct(debt.text,idMsg)
                    let result=  await ControllerDebts.addNewDebts(debtor,dataDebts)
                    if(result){
                        bot.sendMessage(idMsg,`OK`) 
                        bot.sendSticker(idMsg,getStikers(`good`))  
                    }
                    else{
                        bot.sendMessage(idMsg,`ERROR!! `) 
                    }
                    return
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
                    let debtorsName=  await ControllerDebts.getDebtorsName();//получаем всех должников из базы
                    if(debtorsName.error)bot.sendMessage(idMsg,`DataBase error,try later`)//если ошибка отпрвляем
                    let listDebtors = listDebtorsOnTelegram(debtorsName.data,`ПОСМОТРЕТЬ : `)                     
                    await bot.sendMessage(idMsg,'Выберете Контрагента из списка',listDebtors)
                    bot.addListener(`callback_query`,async(res)=>{
                        let debtor = res.data                     
                        bot.off('callback_query')                          
                        let personalDebt= await ControllerDebts.getPersonalDebt(debtor)
                        if(personalDebt.error)bot.sendMessage(idMsg,'error calculate debts')                        
                        bot.sendMessage(idMsg,generateResopnseMessage(personalDebt.data))
                        return
                    })
                 break;
             //=========//
         case `/removedebts`  || /removedebts/.test(msg.text)  :
                bot.off('callback_query')   
                let removeDebtorsName=  await ControllerDebts.getDebtorsName();
                if(removeDebtorsName.error)bot.sendMessage(idMsg,`DataBase error,try later`)
                let removeListDebtors = listDebtorsOnTelegram(removeDebtorsName.data,`ДОБАВИТЬ К : `)
                await bot.sendMessage(idMsg,'Выберете Контрагента из списка',removeListDebtors)
                bot.addListener('callback_query',addRes=>{
                  let debtor = addRes.data
                  bot.off('callback_query')  
                  bot.sendMessage(idMsg,`введите значение`)
                  bot.on('message',async(debt)=>{
                      if(/[/]/.test(debt.text))return NaN
                      let dataDebts = generatePriceProduct(debt.text,idMsg,`-`)//отличе от фукнции добовавления в том что сумма идет со знаком минус
                      let result=  await ControllerDebts.addNewDebts(debtor,dataDebts)
                      if(result){
                          bot.sendMessage(idMsg,`OK`) 
                          bot.sendSticker(idMsg,getStikers(`good`))  
                      }
                      else{
                          bot.sendMessage(idMsg,`ERROR!! `) 
                      }
                      return
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





    

