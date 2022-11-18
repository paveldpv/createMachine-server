const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/firebaseToMongoDB')

const Schema   = mongoose.Schema

const schema = new Schema({
      HistoryOrder:{
         

      },
      auth:{},
      calculationPeople:{
         // name:{
         //    date:String,
         //    id:String,
         //    price:String,
         //    product:String,
         //    senderId:Number
         // }
      },
      order:{
         // id:{
         //    id:{
         //       amount:Number,
         //       date:String,
         //       id:String,
         //       order:String,
         //       performer:{
         //          date:String,
         //          email:String,
         //          id:String,
         //          idTelegram:String,
         //          keyWords:String,
         //          name:String,
         //          phoe:String
         //       },
         //       role:String,
         //       src:String,
         //       units:String,
         //       urgent:Boolean
         //    }
         // }
      },
      otherOrder:{
         // id:{
         //    name:String,
         //    data:{
         //       id:{
         //          date:String,
         //          id:String,
         //          name:String,
         //          src:String,
         //          units:String
         //       }
         //    }
         // }
      },
      performers:{
         // id:{
         //    date:String,
         //    email:String,
         //    id:String,
         //    idTelegram:String,
         //    keyWords:String,
         //    name:String,
         //    phone:String
         // },
         
      },
      removePerformers:{

      },
      stock:String
})


module.exports = schema

