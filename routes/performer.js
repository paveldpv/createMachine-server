const fs = require('fs')
const ControllerPerformers = require('../Controller/Performer')



module.exports = function (app) {
   //модуль для добовления/изменения/удаления контрагентов (исполнителей)
   app.get('/performer',async (req,res)=>{   
    res.send(await  ControllerPerformers.getPerformers())//MongoDB     
   })
   
   app.post(`/addnewperformer`,async (req,res)=>{
      let id = req.body.id
      let performer = req.body          
     if(await ControllerPerformers.addNewPerformers(id,performer)){
      res.send(await ControllerPerformers.getPerformers())
     }
     else{
      res.status(500)
     }
  })
     

   app.delete(`/deletePerformer`,async(req,res)=>{      
      let id =await req.query.id       
      console.log(`candidate to delete id = ${id}`)      
      if(await ControllerPerformers.deletePerformers(id)){
         res.send(await ControllerPerformers.getPerformers())
      }
      else{
         res.status(500)
      }  

   })
}