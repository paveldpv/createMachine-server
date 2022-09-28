const fs = require('fs')

const admin = require('firebase-admin')
const db = admin.database()

const configDataBase = require('../config/dbconfig')


const tranlateDBtoArray = (dbData={})=>{
   let outArrayOrder=[]
   for (const key in dbData) {
      let idGroup = key      
      order= dbData[key]
      for (const id in order) {
         order[id][`idGroup`]=idGroup
         outArrayOrder.push(order[id])
      }

   }

   return outArrayOrder
}


module.exports = function (app) {
   //отправка заказов на front
   app.post('/order',(req,res)=>{
      db.ref(configDataBase.order).once(`value`,result=>{           
         let dbData= result.val()
         res.send(tranlateDBtoArray(dbData))        
      })          
     
   })
}


