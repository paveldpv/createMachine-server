const fs = require('fs')
const admin = require('firebase-admin')
const db = admin.database()

const configDataBase = require('../config/dbconfig')

const arrOtherProduct =(data)=>{
   let outData =[]
   for (const key in data) {
      outData.push(data[key])
   }
   return outData
}

module.exports=function(app){
   //модуль для добовления новый группы разных заказов(не из чертежей)
   //а также добовления новых заказов по предметам не относящимся к чертежам и их изменение
   app.post(`/otherorder`,async (req,res)=>{
     await db.ref(configDataBase.otherOrder).once(`value`,result=>{
         let otherProduct = []
         for (const key in result.val()) {
            let product={
               keyGroup:key,
               data:arrOtherProduct(result.val()[key].data),
               nameGroup:result.val()[key].name
            }
            
            otherProduct.push(product)
         }
         res.send(otherProduct)
      })
   })
   app.post(`/otherorder/addnewgrroup`, async (req,res)=>{
      let idGroup= req.body.id
      let name = req.body.name      
      await db.ref(configDataBase.otherOrder).child(idGroup).set({name:name})
      res.send(`ok`)
   })
   app.delete(`/otherorder/removegroup`,(req,res)=>{      
      let idRemoveGroup = req.query.id
      db.ref(configDataBase.otherOrder).child(idRemoveGroup).set(null)

   })
   app.post(`/otherorder/renamegroup`,(req,res)=>{
      
      
   })
   app.post(`/otherorder/setcomponent`,(req,res)=>{
      
      let idGroup  = req.body.idGroup
      let idRename = req.body.data.id
      let data     = req.body.data
      db.ref(configDataBase.otherOrder).child(idGroup).child(`data`).child(idRename).set(data)
      .then(res.send(`ok`))
   })
   app.post(`/otherorder/addnewcomponent`,(req,res)=>{      
      let idGroup= req.body.idGroup;
      let component = req.body.data;
      db.ref(configDataBase.otherOrder).child(idGroup).child(`data`).child(component.id).set(component)
         .then(res.send(`ok`))
         .catch(res.send(`error`))
      
   })
   app.delete(`/otherorder/removecomponent`,(req,res)=>{
      idRemove= req.query.idRemove;
      idGroup= req.query.idGroup
      db.ref(configDataBase.otherOrder).child(idGroup).child(`data`).child(idRemove).set(null)
         .then(res.send(`ok`))
      
   })
}