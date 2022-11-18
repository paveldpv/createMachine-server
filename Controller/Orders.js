const schema = require(`../DB/dbSchema`)
const DB_CONFIG = require('../DB/idMongoDB');
const mongoose = require('mongoose');
mongoose.connect(DB_CONFIG.URL_DB)
const db = mongoose.model(`datas`,schema)
const moment = require('moment')

const getNameOrNumber = require('./../config/function/getNameOrNumber')

const ControllerHistoryOrder = require('./HistoriOrders')

// const pushHistoryOrder = async (order)=>{   
//    try {      
//       let data = await db.findOneAndUpdate({},{[`HistoryOrder.${order.id}`]:order})
//       data.save()
//    } catch (error) {
//       console.log(error);
//    }
// }
const allOrderPerformer = (data={},id)=>{
   let arrOrder=[]
   for (const id in data) {
      let dataGroup = data[id]      
      for (const key in dataGroup) {
         arrOrder.push(dataGroup[key])
      }
   }
  let result = createOrderToEmail(arrOrder).filter(element=>element.performer.id==id)
  return !result.length==0?result[0].data:[]
  //return createOrderToEmail(arrOrder).filter(element=>element.performer.id==id)[0].data
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

//======DB======//
const getOrders = async ()=>{
   let dataOrders = await db.findById(DB_CONFIG.idDB)
   let res = []
   let data =JSON.parse(JSON.stringify(dataOrders.order))
   for (const key in data) {
      let idGroup = key      
      order= data[key]
      for (const id in order) {
         order[id][`idGroup`]=idGroup
         res.push(order[id])
      }
   }
   return res
}
const setUrgentOrder =async(idOrder,idGroup)=>{
   let res = false
   try {
      let data  = await db.findOneAndUpdate({},{[`order.${idGroup}.${idOrder}.urgent`]:true})
      data.save()
      res = true
   } catch (error) {
       throw error
   }
   return res
}
const closePathOrder = async (idOrder,idGroup,amount,order)=>{
   let res = false
   try {
      await  ControllerHistoryOrder.addHistoryOrder(order)
      let data =  await db.findOneAndUpdate({},{[`order.${idGroup}.${idOrder}.amount`]:amount})
      data.save()
      res = true
   } catch (error) {
      throw error
   }
   return res
}
const closeOrder = async (idOrder,idGroup)=>{
   let res = false
   let closeOrderData = await db.findOne({},[`order.${idGroup}.${idOrder}`])
   let closeOrder = JSON.parse(JSON.stringify(closeOrderData.order[idGroup][idOrder]))
   let now= moment().format(`L`) 
   let deltaTime = moment(now,"MM/DD/YYYY").diff(new Date(closeOrder.date),`days`)
   closeOrder.deltaTime=deltaTime
   closeOrder.dateEnd=now
   console.log(`delta time close order ${closeOrder.name}`,deltaTime);
   await  ControllerHistoryOrder.addHistoryOrder(closeOrder)
   try {
      let close =await db.findOneAndUpdate({},{$unset:{[`order.${idGroup}.${idOrder}`]:1}})     
      if(Object.keys(close.order[idGroup]).length==1){// если в обьекте был последний элемент
         await db.findOneAndUpdate({},{$unset:{[`order.${idGroup}`]:1}})
      }
      close.save()
      res =true
   } catch (error) {
      throw error
   }
   return res
}
const addNewOrders = async(arrOrders = [],idGroup)=>{
   let res = false
   try {
      let outData = new Object()
      arrOrders.forEach(currentOrder=>{      
         outData[currentOrder.id]= currentOrder      
      })  
      let newOrders = await db.findOneAndUpdate({},{[`order.${idGroup}`]:outData})
      newOrders.save()
      res = true      
   } catch (error) {
      throw error
   }
   return res
}
const getOrderCurrentPerformer = async(IDPerformer)=>{
   let res = {
      error:true,
      data:``
   }
   try {
      let data =  await db.findOne({},[`order`])
      console.log(data);
      res.data = allOrderPerformer(JSON.parse(JSON.stringify(data.order)),IDPerformer)
      //если за исполнителем не значится закрепленых заказов error :true
      res.error=!res.data.length==0?false:true

   } catch (error) {
      throw error
   }  
   return res
}

const ControllerOrders = {
   getOrders,
   setUrgentOrder,
   closePathOrder,
   closeOrder,
   addNewOrders,
   getOrderCurrentPerformer
}

module.exports = ControllerOrders