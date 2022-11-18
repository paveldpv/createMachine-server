const schema = require(`../DB/dbSchema`)
const DB_CONFIG = require('../DB/idMongoDB');
const mongoose = require('mongoose');
mongoose.connect(DB_CONFIG.URL_DB)
const db = mongoose.model(`datas`,schema)

const arrOtherProduct =(data)=>{
   let outData =[]
   for (const key in data) {
      outData.push(data[key])
   }
   return outData
}
//=========DB=======//
const getOtherOrder =async()=>{
   let res = []
   let data = await db.findById(DB_CONFIG.idDB)
   let otherOrder = JSON.parse(JSON.stringify(data.otherOrder))
   for (const key in otherOrder) {
      let product={
         keyGroup:key,
         data:arrOtherProduct(otherOrder[key].data),
         nameGroup:otherOrder[key].name
      }      
      res.push(product)
   }
   return res
}
const addNewGroup = async(idGroup,name)=>{
   let res = false
   try {
      let result = await db.findOneAndUpdate({},{[`otherOrder.${idGroup}.name`]:name})
      result.save()
      res=true
   } catch (error) {
      throw error
   }
   return res
}
const removeGroup =async(idGroup)=>{
   let res = false 
   try {
      let result = await db.findOneAndUpdate({},{$unset:{[`otherOrder.${idGroup}`]:0}})
      result.save()
      res=true
   } catch (error) {
      throw error
   }
   return res
}
const renameGroup=async(idGroup,newName)=>{
   let res = false
   try {
      let result =await db.findOneAndUpdate({},{[`otherOrder.${idGroup}.name`]:newName})
      result.save()
      res = true
   } catch (error) {
      throw error
   }
   return res
}
const addNewComponentInGroup=async(idGroup,data)=>{
   let res = false
   try {
      let result =await db.findOneAndUpdate({},{[`otherOrder.${idGroup}.data.${data.id}`]:data})
      result.save()
      res= true
   } catch (error) {
      throw error
   }
   return res
}
const removeComponent =async(idGroup,idDetail)=>{
   let res = false
   try {
      let result = await db.findOneAndUpdate({},{$unset:{[`otherOrder.${idGroup}.data.${idDetail}`]:0}})
      result.save()
      res = true
   } catch (error) {
      throw error
   }
   return res
}


const ControllerOtherOrder = {
   getOtherOrder,addNewComponentInGroup,addNewGroup,removeComponent,renameGroup,removeGroup
}

module.exports = ControllerOtherOrder