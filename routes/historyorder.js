

const admin = require('firebase-admin')
const db = admin.database()
const configDataBase = require('../config/dbconfig')


module.exports = function (app) {   
   app.post(`/historyorder`,(req,res)=>{      
      db.ref(configDataBase.HistoryOrder).once(`value`,result=>{
         let order = result.val()
         let dataHistoryOrder =[]
         for (const key in order) {
            dataHistoryOrder.push(order[key])
         }
         res.send(dataHistoryOrder)
      })
   })
   
}