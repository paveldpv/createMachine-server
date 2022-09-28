const fs = require('fs')
const url = require('../config')
//заменить publcik на static

const foundPath = (name, dir = './Public') => {
  let result
   let re = new RegExp(name)
   let filesOrFolders = fs.readdirSync(dir)
     
   for (let i = 0; i< filesOrFolders.length; i++) {
      let element = filesOrFolders[i]    
      if (re.test(element)) {         
         result = dir + `/` + element               

      } else if (fs.lstatSync(dir + `/` + element).isDirectory()) {        
        result =  foundPath(name, (dir + `/` + element))         
      }
      
      if(result){
         let regExPublic = new RegExp(`\.+[Public]`)
         result = result.replace(regExPublic,`static`)
         break
      }
      
   } 
  
   return result
}


// const getSrcDetail = (obj) => {
//    let res = obj
//    for (const id in res) {
//       let name = res[id].number
//       let dir = './Public'
//       foundPath(name, dir)
//       res[id].src = temp
//    }
//    console.log(res);
//    return res

// }


// module.exports = getSrcDetail
module.exports = foundPath
