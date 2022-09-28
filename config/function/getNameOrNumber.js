 const getNumberAndName =(str=``)=>{

   if(/!/.test(str)){
 
     let [number,name]= str.split(`!`)
 
     return {
       number:number,
       name: name
      }
   }
   return{
     number:str,
     name: str
   }
}

module.exports = getNumberAndName