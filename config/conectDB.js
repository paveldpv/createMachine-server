const admin = require('firebase-admin');
const { initializeApp, applicationDefault} = require('firebase-admin/app');
const serviceAccc = require('./../data/orderbaserspk-firebase-adminsdk-uy6iq-7004df63e5.json')



initializeApp({
   credential: admin.credential.cert(serviceAccc),
   databaseURL:'url'
})

const db = admin.database()
module.exports = db