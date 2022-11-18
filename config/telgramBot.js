const TOKEN   = `5184228479:AAHZtW__zjHKl_LwCbEpXDGkyFumtjX7LG0`
const RspkBot = require('node-telegram-bot-api')
const bot     = new RspkBot(TOKEN, {polling:true})


module.exports=bot



