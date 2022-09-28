const admin = require('firebase-admin');
const { initializeApp, applicationDefault} = require('firebase-admin/app');
const serviceAccc = require('./../data/orderbaserspk-firebase-adminsdk-uy6iq-7004df63e5.json')

initializeApp({
   credential: admin.credential.cert(serviceAccc),
   databaseURL:'https://orderbaserspk-default-rtdb.europe-west1.firebasedatabase.app/'
})

const mainRoutes  = require('./main')
const performer   = require('./performer')
const sendOrder   = require('./sendorder')
const order       = require('./order.js')
const analystic   = require(`./analystic`)
const setorder    = require('./setorder')
const TelegramBot = require('./TelegramBot')
const debts       = require('./debts')
const rename      = require(`./rename`)
const otherOredr  = require('./otherOrder')
const historuOrder= require('./historyorder')


module.exports = function (app) {
   setorder(app),
   mainRoutes(app),
   performer(app),
   sendOrder(app),
   order(app),
   analystic(app),
   TelegramBot(app),
   debts(app),
   rename(app),
   otherOredr(app),
   historuOrder(app)
   
}




