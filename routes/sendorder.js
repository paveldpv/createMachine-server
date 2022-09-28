const fs = require('fs')
const admin = require('firebase-admin');
const { initializeApp, applicationDefault} = require('firebase-admin/app');
const configDataBase = require('../config/dbconfig');
const bot = require('../config/telgramBot')
const idChanel  =require ('./../config/idChanel')
const serviceAccc = require('./../data/orderbaserspk-firebase-adminsdk-uy6iq-7004df63e5.json')//!удалить после проверки
const moment = require('moment')


const uniqid = require('uniqid'); 

const getNameOrNumber = require('./../config/function/getNameOrNumber')

const nodemailer = require('./../config/nodemailer');

const createMessageOrder = require('../config/function/createMessageOrder');
const ArrFiles     = require('../config/function/createArrFilesToSendEmail');



// initializeApp({
//    credential: admin.credential.cert(serviceAccc),
//    databaseURL:'https://orderbaserspk-default-rtdb.europe-west1.firebasedatabase.app/'
// })//!удлить после проверки

const reportOrderOnTelegram = (id,dataOrder)=>{
   let msg=``
   dataOrder.forEach(element=>{
      msg +=`${getNameOrNumber(element.order).name} количество =  ${element.amount} \n`       
     })
     bot.sendMessage(id,msg)
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

const allOrderPerformer = (data={},id)=>{
   let arrOrder=[]
   for (const id in data) {
      let dataGroup = data[id]
      for (const key in dataGroup) {
         arrOrder.push(dataGroup[key])
      }
   }
   
  return createOrderToEmail(arrOrder).filter(element=>element.performer.id==id)[0].data
}

const sendSummarOrders= (order=[],email,mailer)=>{
   console.log(`working..`);
   let arrFiles = ArrFiles(order)   
   let data = moment().format(`LL`)   
   let msg =createMessageOrder(order,true) 
   
   mailer(email,msg,data,arrFiles)
}



const db = admin.database()
//создание заказа
module.exports=function(app){
   app.post('/sendorder',(req,res)=>{  
     
      let dataOrder = req.body.orderPerformer
      console.log(`order ==`);  
      console.log(dataOrder);//[]
      let idGroup= uniqid(dataOrder[0].id)
      db.ref(configDataBase.order).child(idGroup).set(dataOrderToDB(dataOrder))
      reportOrderOnTelegram(idChanel.pavelDeniskin,dataOrder)      
      sendOrders(createOrderToEmail(dataOrder),nodemailer)
      res.send(`ok`)
      
     console.log(`try....`);
      
   })
   app.post(`/summaruOrder`,async (req,res)=>{
      let performerId   = req.body.performerID
      let role          = req.body.role
      let extendedEmail = req.body.extendedEmail
      let currentEmail =``
      console.log(req.body);
      await db.ref(configDataBase.performers).child(performerId).once(`value`,email=>{
         currentEmail = email.val().email
      })
       db.ref(configDataBase.order).once(`value`,result=>{   
         if(result.val()){
            let dataAllOrder =  allOrderPerformer(result.val(),performerId);         
           sendSummarOrders(dataAllOrder,currentEmail,nodemailer)
           sendSummarOrders(dataAllOrder,extendedEmail,nodemailer)
         }
         else{
            console.log(`not found order to performer`);
         }           
         
      })
      .then(res.send(`ok`))
      
      
   })
}

