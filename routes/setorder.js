const fs = require('fs')

const admin = require('firebase-admin')
const db = admin.database()
const moment = require('moment')
const configDataBase = require('../config/dbconfig')



module.exports = function (app) {
   app.delete('/setorder',async (req,res)=>{
      //удаление заказа - перед удалением помещаям заказ переданый на удаление в историю закзао
      //при этом записывая время исполнения заказа в днях 
      const idRemove = req.query.idRemove
      const idGroupRemove = req.query.idGroupRemove  
      await db.ref(configDataBase.order).child(idGroupRemove).child(idRemove).once(`value`,result=>{
         let historyOrder = result.val()
         let dataStartOrder= historyOrder.data
         let now= moment().format(`L`)
         let deltaTime = moment(now,"MM/DD/YYYY").diff(dataStartOrder,`days`)
         historyOrder.deltaTime=deltaTime
         historyOrder.dateEnd=now
         db.ref(configDataBase.HistoryOrder).child(historyOrder.id).set(historyOrder)
      })    
      db.ref(configDataBase.order).child(idGroupRemove).child(idRemove).set(null) 

      await res.send('ok')     
   })
   app.post(`/setorder/urgent`,(req,res)=>{     
      //изменение приоритата заказа  
      let idOrder = req.body.id
      let idGroup = req.body.idGroup
      db.ref(configDataBase.order).child(idGroup).child(idOrder).child(`urgent`).set(true) 
      .then(res.send(`ok`))    

   })
   app.post(`/setorder/removepathorder`,(req,res)=>{     
      //удаление части закзаз по переданому количеству
      let idOrder     = req.body.idOrder
      let idGroup     = req.body.idGroup
      let amount      = req.body.setAmount
      let dataHistory = req.body.dataOrder
      db.ref(configDataBase.HistoryOrder).push(dataHistory)
      db.ref(configDataBase.order).child(idGroup).child(idOrder).child(`amount`).set(amount)
      .then(res.send(`ok`))
      
   })

   
}