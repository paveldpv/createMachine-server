const schema = require(`../DB/dbSchema`)
const DB_CONFIG = require('../DB/idMongoDB');
const mongoose = require('mongoose');
mongoose.connect(DB_CONFIG.URL_DB)
const db = mongoose.model(`datas`,schema)

const getPerformers =async ()=>{   
  let res        = []
  let data       = await db.findById(DB_CONFIG.idDB)
  let performers = JSON.parse(JSON.stringify(data.performers))    
  for (const key in performers) {
    res.push(performers[key])
  }  
  return res
}
const addNewPerformers = async(id,performer)=>{
  let res= false
  try {
    let data = await db.findOneAndUpdate({},{[`performers.${id}`]:performer})
    data.save()
    res = true
  } catch (error) {
   throw error 
  }
  return res
}

const deletePerformers =async(id)=>{
  let res = false  
  try {    
    let candidateToRemove = await db.findOne({},[`performers.${id}`]) // получеам исполнитля что бы доавить его в список удаленых
    await db.updateOne({[`removePerformers`]:candidateToRemove.performers})
    let data = await db.findOneAndUpdate({},{$unset:{[`performers.${id}`]:1}})//удаляемс исполнителя
    data.save()
    res=true
  } catch (error) {
    throw error
  } 
  return res
}
const getActualEmail = async(id)=>{  
  let data =await db.findOne({},[`performers.${id}`])
  return data.performers[id].email
}

const ControllerPerformers=    {
   deletePerformers,
   addNewPerformers,
   getPerformers,
   getActualEmail
}
module.exports = ControllerPerformers