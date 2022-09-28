const fs = require('fs')
const url = require('../config/config')
const getSrcBearing = require('../config/function/getSrcBearing')

module.exports = function (app) {
   //основное - навигация по папкам + если в папке есть каталог с подшипниками 
   //(bearing.json) то отображение подшипинков отлеьными позициями в каталоге
   app.get(`/exploer`, (req, res) => {

      const base = './Public/';
      let   path = '';

      function IsFolder(path) {
         return fs.lstatSync(path).isDirectory() && fs.existsSync(path)
      }

      if (`path` in req.query) {
         path = req.query.path
      }
      let isCatalog = /Каталог/.test(path)


      if (IsFolder(base + path)) {
         let files = fs.readdirSync(base + path).map((item) => {

            if(!/Bearing/.test(item)){

               const isDir = fs.lstatSync(base + path + `/` + item).isDirectory()
               let   size  = 0;
               let   src   = ``
               if (!isDir) {
                  
                  size = fs.statSync(base + path + `/` + item)
                  src  = `${url}static/${path}/${item}`//тут не надо отсылать url лучше его добовлять динамически
               }
               return {
                  name: item,             //один из элементов массива 
                  dir : isDir,
                  size: size.size ?? 0,
                  src : src
               }
            }
            else{
               
               const srcImageBearing =  fs.readdirSync('./BearingImage')
               const dataBearings = JSON.parse(fs.readFileSync(base+path+`/`+item))
               
               
               return dataBearings.map(item=>{
                  
                     return  {
                        name:`${item.number}!${item.bearing} подшипник`,
                        dir:false,
                        amount:item.amount,
                        sizeBearing:{
                           externalDiametr:item.external_diameter,
                           innerDiametr:item.inner_diameter,
                           height:item.height,
                        },
                        src:getSrcBearing(srcImageBearing,item.type),
                        
                     }    
                                
               })
               
            }
         })

         
         res.json({
            path     : path,
            result   : true,
            files    : files.flat(),     //массив элементов
            isCatalog: isCatalog
         })
      } 



   })
}