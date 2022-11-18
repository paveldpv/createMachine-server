const ControlleHistoryOrder = require('./../Controller/HistoriOrders')

module.exports = function (app) {   
   app.post(`/historyorder`,async(req,res)=>{      
      let limitStart = req.body.limitStart;
      let limitEnd = req.body.limitEnd;
      let searchIDPerformer = req.body.performersID     
      const data =await ControlleHistoryOrder.getHistory(limitStart,limitEnd,searchIDPerformer)
      res.send(data)
   })
   app.post(`historyorder/search`,async(req,res)=>{
      
   })
   
}