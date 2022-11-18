const fs = require('fs')

const moment = require('moment')
const uniqid = require('uniqid'); 

const bot = require('../config/telgramBot')
const idChanel  =require ('./../config/idChanel')

const ControllerOrders = require('./../Controller/Orders')
const ControllerPerformers = require('./../Controller/Performer')

const nodemailer = require('./../config/nodemailer');
const getNameOrNumber = require('./../config/function/getNameOrNumber')

const createMessageOrder = require('../config/function/createMessageOrder');
const ArrFiles     = require('../config/function/createArrFilesToSendEmail');




const reportOrderOnTelegram = (id,dataOrder)=>{
   let msg=`<b>ЗАКАЗ</b>
`
   dataOrder.forEach(element=>{
      msg +=`<b>${getNameOrNumber(element.order).name.replace(`.jpg`,` `)}</b> количество =  <b>${element.amount}</b>
`       
     })     
     bot.sendMessage(id,msg,{parse_mode:`HTML`})
}

const dataOrderToDB = (data=[])=>{
   let outData = new Object()
   data.forEach(currentOrder=>{      
      outData[currentOrder.id]= currentOrder      
   })
   return outData
}

const createOrderToEmail = (data=[])=>{
   let outData =[]   
    data.forEach(element=>{
      let outElement = new Object()      
      outElement.performer=element.performer      
      outElement.data=[]
      let order = {
         order:getNameOrNumber(element.order).name,
         amount:element.amount,
         date:element.date,
         src:element.src,
         urgent:element.urgent,
         units:element.units
      }
      outElement.data.push(order)      
      outData.push(outElement)
     })  

     //промежуточный результат в outData
     let finishedResult=[]
     outData.forEach(elementOrder=>{
      let tempOrder = {
         performer:elementOrder.performer,
         data:elementOrder.data
      }

         if(finishedResult.length!=0){

            let repeatPerformer = finishedResult.some(element=>{                            
              return element.performer.id==elementOrder.performer.id
            })//проверяем есть ли в финишном массиве тото же самый исполнитель
           
            if(repeatPerformer){
               finishedResult.forEach(orderFinished=>{
                  if(orderFinished.performer.id==elementOrder.performer.id){
                     orderFinished.data.push(elementOrder.data[0])
                  }            
               })
               }
            else{
               finishedResult.push(tempOrder)
            }
         }
         else{
            finishedResult.push(tempOrder)
         }
     })
   return finishedResult
}

const sendOrders =(data=[],mailer)=>{
   data.forEach(elementOrder=>{      
     let msg   = createMessageOrder(elementOrder.data)
     let files = ArrFiles(elementOrder.data)
    console.log(files);
      mailer(elementOrder.performer.email ,msg, elementOrder.data[0].date,files)
      //console.log(files);
   })
}



const sendSummarOrders= (order=[],email,mailer)=>{
   console.log(`working..`);
   let arrFiles = ArrFiles(order)   
   let data = moment().format(`LL`)   
   let msg =createMessageOrder(order,true) 
   
   mailer(email,msg,data,arrFiles)
}




//создание заказа
module.exports=function(app){
   app.post('/sendorder',async(req,res)=>{  
     
      let dataOrder = req.body.orderPerformer
      console.log(`order ==`);  
      console.log(dataOrder);//[]
      let idGroup= uniqid(dataOrder[0].id)
      let result=  await ControllerOrders.addNewOrders(dataOrder,idGroup)
      // db.ref(configDataBase.order).child(idGroup).set(dataOrderToDB(dataOrder))
      if(result){
         reportOrderOnTelegram(idChanel.rspkGrooup,dataOrder)      
         sendOrders(createOrderToEmail(dataOrder),nodemailer)
         res.send(`ok`)      
         console.log(`try....`);         
      }
      
      
   })
   //"выслать сводку"
   app.post(`/summaruOrder`,async (req,res)=>{
      let performerId   = req.body.performerID
      let role          = req.body.role
      let extendedEmail = req.body.extendedEmail
      let currentEmailPerformer=  await ControllerPerformers.getActualEmail(performerId)
      let currentEmail =``
      console.log(req.body);
      let result = await ControllerOrders.getOrderCurrentPerformer(performerId)
      console.log(`===========`);
      console.log(result);
      console.log(`===========`);
      if(!result.error){
        sendSummarOrders(result.data,currentEmailPerformer,nodemailer)
        sendSummarOrders(result.data,extendedEmail,nodemailer)
        console.log(`ok`);
        res.send(`сводка отправлена`)
      }
      else{
         console.log(`not`);
         res.json({
            message:`у данного исполнителя нет активных заказов`,
            error:true
         })
      }

     
      
      
   })
}

