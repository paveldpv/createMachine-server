const express = require('express')
const fileUpload = require('express-fileupload')
const app = express();
const PORT =process.env.PORT || 5000


app.use(function(req,res,next){
   res.setHeader('Access-Control-Allow-Origin','*');
   res.setHeader('Access-Control-Allow-Methods','DELETE','GET','POST');
   res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
   res.setHeader('Access-Control-Allow-Credentials',true);
   express.static('public')
   next()
})

app.use(fileUpload())//uploadFile
app.use(express.json());
app.use(express.urlencoded());

require('./routes')(app)

app.listen(PORT, () => {
   console.log(`server work on port : ${PORT}...`);
})


app.use('/static' , express.static("Public"))
app.use('/Bearing',express.static("BearingImage"))

