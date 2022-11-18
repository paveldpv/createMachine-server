const fs = require('fs')


const ControllerDebts = require('./../Controller/Debts')



module.exports = function (app) {
   app.post('/debts',async (req,res)=>{        
      res.send(await ControllerDebts.getDebts())
           
   })
   
   app.get('/debts',async(req,res)=>{//добовлени нового контрагента по долгам
      let newCaunterparty = req.query.counterparty;
      console.log(newCaunterparty);
      let result = await ControllerDebts.newCounterparty(newCaunterparty)
      if(result)res.send(`ok`)
      res.status(500)
      
   })

   app.post('/editdebt',async(req,res)=>{
     let people = req.body.people;
     let idDebts     = req.body.id;
     let data   = req.body.data;
      console.log(data);
     let result = await ControllerDebts.editDebt(people,idDebts,data)
     if(result) res.send(`ok`)
     res.status(500)

   })
   app.post('/addnewdebt',async(req,res)=>{
      let data = req.body.data
      let people = req.body.people
      let result = await ControllerDebts.addNewDebts(people,data)
      if(result)res.send(`ok`)
      res.status(500)
   })
   app.post('/removedebts',async(req,res)=>{
      let people = req.body.people
      let idDebt = req.body.id
      console.log(idDebt);
      let result = await ControllerDebts.removeDebt(people,idDebt)
      if(result)res.send(`ok`)
      res.status(500)
   })

}