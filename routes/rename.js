const fs = require(`fs`);
const { url } = require('../config/config');


//данная функцтя носит временый характер
//можно добавить к файлу номер из спецификации 
function addNumber(addNumber,oldName ){
   let result
   if(/!/.test(oldName)){
     let arrName =  oldName.split(`!`);
     arrName[0]=addNumber;
     result = arrName.join(`!`)
   }
   else{
      result=  addNumber+`!`+oldName
   }
   return result
}

module.exports = function(app){
   app.post('/rename',(req,res)=>{      
      
      let number = req.body.detail.addName;
      let oldName   = req.body.detail.oldName;
      let path      ='./Public'+req.body.detail.path+`/`;
           
      console.log(path+oldName);
      fs.rename(path+oldName,path+addNumber(number,oldName),err=>{
         if(err){
            console.log(err)
            console.log(`переменование не удалось`);
            res.send(err)
         }
         else{
            res.send(`ok`)
            
         }
      })
   })
}