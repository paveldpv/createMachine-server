const nodemailer = require('nodemailer')

async function sendOrderToPerformer (to , msg=`` , date=`` ,files=[], subject=`заявка от РСПК дата`){
   let transporter = nodemailer.createTransport({
      service:"Yandex",
      host:"smtp.yandex.ru",
      port:465,
      secure:true,
      auth:{
         user:"email",
         pass:"password"
      }
      
   })
   
   let info = await transporter.sendMail({
      from:'rspksnab@yandex.ru',
      to:to,
      subject:`${subject} : ${date}`,
     // text:msg,
      html:msg,
      attachments:files

   })
   console.log(`message sent %s`,info.messageId);
}
module.exports = sendOrderToPerformer