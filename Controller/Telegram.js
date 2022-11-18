const schema = require(`../DB/dbSchema`)
const DB_CONFIG = require('../DB/idMongoDB');
const mongoose = require('mongoose');
mongoose.connect(DB_CONFIG.URL_DB)
const db = mongoose.model(`datas`,schema)





const ControllerTelegram = {

}

module.exports= ControllerTelegram