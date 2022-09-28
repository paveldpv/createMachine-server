const fs = require('fs')


const configDataBase = require('../config/dbconfig')

const admin = require('firebase-admin');
const db = admin.database()

async function  getPerformers (){
   let performers =[]   
  await db.ref(configDataBase.performers).once(`value`,async result=>{
      let responseDBperformers = await result.val()
      for (const key in responseDBperformers) {
       performers.push(responseDBperformers[key])
        
      }      
      
   })
   
   return await performers
}

module.exports = function (app) {
   //модуль для добовления/изменения/удаления контрагентов (исполнителей)
   app.get('/performer',async (req,res)=>{      
      res.send(await getPerformers())
   })
   
   app.post(`/addnewperformer`,async (req,res)=>{
      let id = req.body.id
      let performer = req.body      
      await db.ref(configDataBase.performers).child(id).set(performer)

      res.send(await getPerformers())
   })
   app.delete(`/deletePerformer`,async(req,res)=>{
      console.log(req.query.id);
      let id =await req.query.id       
      await db.ref(configDataBase.performers).child(id).set(null)
      
      res.send(await getPerformers())

   })
}