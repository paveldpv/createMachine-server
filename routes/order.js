const fs = require('fs')

const admin = require('firebase-admin')
const db = admin.database()

const configDataBase = require('../config/dbconfig')

const ControllerOrders = require('./../Controller/Orders')
const bot = require('./../config/telgramBot')
const idChanel  =require ('./../config/idChanel')
const getNumberAndName = require('./../config/function/getNameOrNumber')

const reportRemoveOrder =async(path=false,order)=>{
   if(!path){
      msg = `готовность заказа ${getNumberAndName(order.order).name.replace(`.jpg`,` `)} в количестве ${order.amount}шт
      <b> исполнитель ${order.performer.name}</b>`
     bot.sendMessage(idChanel.rspkGrooup ,msg,{parse_mode:`HTML`})
   }
   else{      
       msg = `готовность части  заказа ${getNumberAndName(order.order).name.replace(`.jpg`,` `)} в количестве ${order.amount}шт
       <b> исполнитель ${order.performer.name}</b>`
      bot.sendMessage(idChanel.rspkGrooup ,msg,{parse_mode:`HTML`})
   }
}





module.exports = function (app) {
   //отправка заказов на front
   app.post('/order',async (req,res)=>{          
     res.send(await ControllerOrders.getOrders())     
   })

   app.post(`/setorder/urgent`,async(req,res)=>{     
      //изменение приоритата заказа  
      let idOrder = req.body.id
      let idGroup = req.body.idGroup       
      let result =  await ControllerOrders.setUrgentOrder(idOrder,idGroup)
      if(result)res.send(`ok`)
      res.status(500)
        
   })
   app.post(`/setorder/removepathorder`,async(req,res)=>{     
      //удаление части закзаз по переданому количеству
      let idOrder     = req.body.idOrder
      let idGroup     = req.body.idGroup
      let amount      = req.body.setAmount
      let dataHistory = req.body.dataOrder      
      let result = await ControllerOrders.closePathOrder(idOrder,idGroup,amount,dataHistory)
      reportRemoveOrder(true,dataHistory)
      if(result) res.send(`ok`)       
      res.status(500)
           
   })
   app.delete('/setorder',async (req,res)=>{
      //удаление заказа - перед удалением помещаям заказ переданый на удаление в историю закзао
      //при этом записывая время исполнения заказа в днях 
      const idRemove = req.query.idRemove
      const idGroupRemove = req.query.idGroupRemove  
      console.log(`close order`);
      const order={
         order:req.query.orderName,
         amount:req.query.amount,
         performer:{
            name:req.query.performer
         }
      }      
      let result =  await ControllerOrders.closeOrder(idRemove,idGroupRemove)
      reportRemoveOrder(false,order)
      console.log(`result`,result);
      if(result) res.send(`ok`)      
      res.status(500)
         
   })

}


