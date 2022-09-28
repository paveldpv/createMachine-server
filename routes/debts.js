const fs = require('fs')
const admin = require('firebase-admin')
const db = admin.database()

const configDataBase = require('../config/dbconfig')

const uniqid = require('uniqid'); 
const moment = require('moment')

let initialDebts = {
       product : `initial`,
        price   : 0,
        id      : uniqid(),
        date    : moment().format('L'),
        
}

module.exports = function (app) {
   app.post('/debts',async (req,res)=>{        

      if(req.body.people){//если body не пустой то добовляем значение         
         let people = req.body.people;
         let debt = req.body.data;
         await db.ref(configDataBase.calculationPeople+people).push(debt)
      }

      db.ref(configDataBase.calculationPeople).once(`value`,result=>{

        let reqDebts = result.val()        
        let resDebts=[]
        for (const key in reqDebts) {               
           let obj =  reqDebts[key]           
           let temp=[]
            for (const id in obj) { 
               obj[id].currentId=id
               temp.push(obj[id])
              
            }

            let result = {
               people:key,               
               dataDebts:temp
            }
            resDebts.push(result)         
        }        
        res.send(resDebts)
      })     
   })
   
   app.get('/debts',(req,res)=>{//добовлени нового контрагента по долгам
      let newCaunterparty = req.query.counterparty;
      console.log(newCaunterparty);
      db.ref(configDataBase.calculationPeople).child(newCaunterparty).push(initialDebts)
      res.send(`ok`)
   })

   app.post('/editdebt',(req,res)=>{
     let people = req.body.people;
     let id     = req.body.id;
     let data   = req.body.data;
     console.log(data);
     db.ref(configDataBase.calculationPeople+people).child(id).set(data)
      .then(res.send(`ok`))
      .catch(err=>console.error(err))


   })

}