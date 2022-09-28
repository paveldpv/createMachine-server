const TOKEN   = `TOKEN_TELEGRAM_BOT`
const RspkBot = require('node-telegram-bot-api')
const bot     = new RspkBot(TOKEN, {polling:true})


module.exports=bot



