const createMessageOrder =(data=[],summary=false)=>{
   
   let date = data[0].date||NaN
   let tBody = data.map((order,index)=>{  
      let color = order.urgent?`#d52828`:`#000`       
      return (
         `         
            <tbody  style="border: 2px solid black; text-align:center; font-size:18px; color:${color}" >
               <td>${index}</td>
               <td>${order.order}</td>
               <td>${order.amount} ${order.units||`шт`}</td>
               <td>${order.date}</td>
            </tbody>
            
         `        
      )
   }).reduce((previousValue, currentValue)=>previousValue+currentValue,``)
   
   let message=``
   if(!summary){
       message=`
       <table style="border: 2px solid black; width: 1000px; margin:0 auto;">
            <caption>
            <h2>Заказы</h2>
            <h3>от ${date}</h3>
            </caption>
               <thead style="border: 1px dashed black;">
                  <tr>
                     <th>Номер</th>
                     <th>Деталь</th>
                     <th>Количество</th>
                     <th>Дата</th>
                  </tr>
               </thead>
              <br>
            ${tBody}
            </table>
            <hr>
            <span style="width: 1000px" >
               <h4>
               Данный заказ был сформирован автоматический,<br>
               Ждем счет (=<br>
               по все вопросам обращаться по телефону 89106292550 Денискин Павел
               </h4>
            </span>
      ` 
   }
   else{
      message=`
       <table style="border: 2px solid black; width: 1000px; margin:0 auto;">
            <caption>
            <h2>Сводка ожидаемых от вас деталей и копмлектующих </h2>
            <h3>от ${date}</h3>
            <h3>данное сообщение несет инормационый характер и не требует ответа</h3>
            <br>
            <br>
            </caption>
               <thead style="border: 1px dashed black;">
                  <tr>
                     <th>Номер</th>
                     <th>Деталь</th>
                     <th>Количество</th>
                     <th>Дата</th>
                  </tr>
               </thead>
              <br>
              <br>
            ${tBody}
            </table>
            <hr>
            <span style="width: 1000px" >
               <h4>
               Данный заказ был сформирован автоматический,<br>
               <h2>это сообщение призвано сообщить вам о деталях которые мы ожидаем от вас</h2> <br>
               по все вопросам обращаться по телефону 89106292550 Денискин Павел
               </h4>
            </span>
      `       
   }
   
  return message
}




module.exports = createMessageOrder


