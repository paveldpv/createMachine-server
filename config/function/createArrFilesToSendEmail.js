
const createArrFilesToSendEmail =(data=[])=>{
   
   let files=[]
   data.forEach(order=>{    
     
      if(/Чертежи станков/.test(order.src)){//проверка если в переданый  src из папки static то высылвать чертеж
         files.push({
            filename: order.order,
            path    : `./Public`+order.src.split(`static`)[1],
            cid:order.order
         })
         
      }
   })
   return files
}

module.exports = createArrFilesToSendEmail
