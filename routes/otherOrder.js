const fs = require('fs')

const ControllerOtherOrder  =require('./../Controller/OtherOrders')




module.exports=function(app){
   //модуль для добовления новый группы разных заказов(не из чертежей)
   //а также добовления новых заказов по предметам не относящимся к чертежам и их изменение
   app.post(`/otherorder`,async (req,res)=>{
      let result = await ControllerOtherOrder.getOtherOrder()     
     res.send(result)
 

   })
   app.post(`/otherorder/addnewgrroup`, async (req,res)=>{
      let idGroup= req.body.id
      let name = req.body.name    
      let result = await ControllerOtherOrder.addNewGroup(idGroup,name)  
      if(result)res.send(`ok`)     
      res.status(500)
      
   })
   app.delete(`/otherorder/removegroup`,async(req,res)=>{      
      let idRemoveGroup = req.query.id
      let result = await ControllerOtherOrder.removeGroup(idRemoveGroup)
      if(result)res.send(`ok`)
      res.status(500)
     
      
   })
   app.post(`/otherorder/renamegroup`,async(req,res)=>{
      let idGroup = req.body.idGroup
      let newName = req.body.newName
      let result = await ControllerOtherOrder.renameGroup(idGroup,newName)
      if(result) res.send(`ok`)
      res.status(500)
      
   })
   app.post(`/otherorder/setcomponent`,async(req,res)=>{
      
      let idGroup  = req.body.idGroup     
      let component     = req.body.data
      let result = await ControllerOtherOrder.addNewComponentInGroup(idGroup,component)
      if(result)res.send(`ok`)
      res.status(500)
      
   })
   app.post(`/otherorder/addnewcomponent`,async(req,res)=>{      
      let idGroup= req.body.idGroup;
      let component = req.body.data;
      let result = await ControllerOtherOrder.addNewComponentInGroup(idGroup,component)
      if(result)res.send(`ok`)
      res.status(500)
      
   })
   app.delete(`/otherorder/removecomponent`,async(req,res)=>{
      idRemove= req.query.idRemove;
      idGroup= req.query.idGroup
      let result = await ControllerOtherOrder.removeComponent(idGroup,idRemove)
      if(result)res.send(`ok`)
      res.status(500)
     
   })
}