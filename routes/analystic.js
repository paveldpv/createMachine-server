const fs = require('fs')
const admin = require('firebase-admin')
const db = admin.database()

const mv = require('mv')

const uniqid = require('uniqid');
const moment = require('moment')

const configDataBase = require('../config/dbconfig')

const foundPath = require('../config/function/getSrcDetail')

const url = require('./../config/config');

const priceCounterparty = (data = []) => {
   let outObj = []
   data.forEach(element => {
      let detail = {
         number: element.number ? element.number : `неназначено`,
         id: uniqid(),
         dataCreatePrice: moment().format(`L`),
         price: element.price ? element.price : `неназначено`,
         src: foundPath(element.number) ? url+foundPath(element.number) :  null

      }

      outObj.push(detail)
   })

  console.log(outObj);

   return outObj
}


module.exports = function (app) {
   app.post('/analystic/couterparty', (req, res) => {
      let sampleFile = ``
      let pathFile = ``
      let nameFile = ``
     
      if (!req.files && Object.keys(req.body).length == 0) {

         db.ref(configDataBase.detail).on('value', result => {

            let dataProduction = []
            for (const key in result.val()) {
               let objCountrerparty = {
                  counterparty: key
               }
               dataProduction.push(objCountrerparty)
            }
            res.send(dataProduction)
            // res.send(getSrcDetail(result.val()))
         })
      }
      else {
         nameFile = req.files.counterparty.name
         
         if (!/.json/.test(nameFile)) return res.send(`bad file,not JSON`)

         sampleFile = req.files.counterparty
         pathFile = `.\\counterparty\\${nameFile}`

         sampleFile.mv(pathFile, async (err) => {
            if (err) return res.status(500).send(err)

            //res.send(`ok`)
            fs.readFile(pathFile, (err, data) => {
               if (err) {
                  console.log(err);
               }
               else {
                  let dataPrice = priceCounterparty(JSON.parse(data))
                  console.log(dataPrice);
                  
                  try {
                     db.ref(configDataBase.detail).child(nameFile.split(`.`)[0])
                     .set(dataPrice)  
                    
                  } catch (error) {
                     console.log(error);
                     res.send(error)
                  }               

               }

            })
         })

      }
   })
   app.post(`/analystic/getprice`,(req,res)=>{      
      let nameCouterpaty = req.body.nameCounterparty 
      console.log(nameCouterpaty);
      // db.ref(configDataBase.detail).child(nameCouterpaty).once(`value`,result=>{         
      //    res.send(result.val())
      // })
      
   })

}