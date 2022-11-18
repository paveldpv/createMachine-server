const mongoose = require('mongoose');


const Schema =mongoose.Schema

const historyOrdersSchema = new Schema({
   amount:Number,
   date:Date,
   dateEnd:Date,
   deltaTime:Number,
   id:String,
   order:String,
   performer:{
      date:String,
      email:String,
      id:String,
      idTelegram:String,
      keyWords:String,
      name:String,
      phone:String
   },
   role:String,
   src:String,
   units:String,
   urgent:Boolean
})
module.exports = historyOrdersSchema