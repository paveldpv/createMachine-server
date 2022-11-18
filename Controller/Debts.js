const schema = require(`../DB/dbSchema`)
const DB_CONFIG = require('../DB/idMongoDB');
const mongoose = require('mongoose');
mongoose.connect(DB_CONFIG.URL_DB)
const db = mongoose.model(`datas`,schema)


const uniqid = require('uniqid'); 
const moment = require('moment')

let initialDebts = {
   product : `initial`,
    price   : 0,
    id      : uniqid(),
    date    : moment().format('L'),
    
}
let transformDebtsToFrontData =(data={})=>{
   let res = []
   for (const key in data) {               
      let obj =  data[key]           
      let temp=[]
       for (const id in obj) { 
          obj[id].currentId=id
          temp.push(obj[id])
         
       }

       let result = {
          people:key,               
          dataDebts:temp
       }
       res.push(result)         
   }
   return res
}

//======DB=======//
const getDebts = async()=>{   
   let result = await db.findOne({},[`calculationPeople`])
   let dataDebts = JSON.parse(JSON.stringify(result.calculationPeople))
   //front принимает значение в формате [
   //    people:`name`
   //    dataDebts:[{}]
   // ]
   return transformDebtsToFrontData(dataDebts)

}
const newCounterparty =async(name)=>{
   let res = false
   try {
      let result = await db.findOneAndUpdate({},{[`calculationPeople.${name}.${uniqid()}`]:initialDebts})
      result.save()
      res= true
   } catch (error) {
      throw error
   }
   return res
}
const editDebt = async(people,idDebt,data)=>{
   res = false
   try {
      let result = await db.findOneAndUpdate({},{[`calculationPeople.${people}.${idDebt}`]:data})
      result.save()
      res=true 
   } catch (error) {
      throw error
   }
   return res
}
const addNewDebts =async(people,dataDebts)=>{
   let res = false
   try {
      let result = await db.findOneAndUpdate({},{[`calculationPeople.${people}.${dataDebts.id}`]:dataDebts})
      result.save()
      res=true
   } catch (error) {
      throw error
   }
   return res
}
const removeDebt =async(people,idDebt)=>{
   let res = false
   try {
      let result = await db.findOneAndUpdate({},{$unset:{[`calculationPeople.${people}.${idDebt}`]:0}})
      result.save()
      res=true
   } catch (error) {
      throw error
   }
   return res
}
const getDebtorsName = async()=>{
   let res={
      error:true,
      data:[]
   }//массив имен должников
   try {
      let result = await db.findOne({},[`calculationPeople`])
      res.data=[...Object.keys(JSON.parse(JSON.stringify(result.calculationPeople)))]
      res.error=false
   } catch (error) {
      throw error
   }

   return res

}
const getPersonalDebt = async(name)=>{
   console.log(name);
   let res={
      error:true,
      data:{}
   }
   try {
      let result =await db.findOne({},[`calculationPeople`])    
      let debts=(JSON.parse(JSON.stringify(result.calculationPeople)))
      res.data=debts[name]      
      res.error=false
   } catch (error) {
      throw error
   }
   return res
}


const ControllerDebts = {
   getDebts,newCounterparty,editDebt,addNewDebts,removeDebt,getDebtorsName,getPersonalDebt
}

module.exports = ControllerDebts