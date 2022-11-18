//const schema = require(`../DB/dbSchema`)
const DB_CONFIG = require('../DB/idMongoDB');
const mongoose = require('mongoose');
mongoose.connect(DB_CONFIG.URL_DB)
//const db = mongoose.model(`datas`,schema)

const historyOrdersSchema = require('./../DB/dbSchemaHistoryOrders')
const dbHistory = mongoose.model('historyorders',historyOrdersSchema)



const getHistory =async(limStart,LimEnd,performersID=[])=>{
   let res={data:[], dataLength:0}
   let historyOrder = []
   if(performersID.length===0){
     
     let dataOrders =await dbHistory.find({})    
     historyOrder =JSON.parse(JSON.stringify(dataOrders))     
      
   }
   else{
      let dataOrders = await dbHistory.find({['performer.id']:performersID})
      historyOrder=JSON.parse(JSON.stringify(dataOrders))  
      
   }
   
   
   res.data=historyOrder.slice(limStart,LimEnd>historyOrder.length-1?historyOrder.length:LimEnd)
   res.dataLength=historyOrder.length
   return res
}
const getHistorySearch =async(order)=>{

}

const removeOrder = ()=>{

}
const addHistoryOrder =async (order)=>{
   try {      
     // let data = await db.findOneAndUpdate({},{[`HistoryOrder.${order.id}`]:order})
     // data.save()
      const history = new dbHistory(order)
      history.save()          
     
   } catch (error) {
      console.log(error);
   }
}
const getThisOrder = async(name)=>{

}

const ControllerHistoryOrder = {
   addHistoryOrder,
   getHistory

}

module.exports=ControllerHistoryOrder