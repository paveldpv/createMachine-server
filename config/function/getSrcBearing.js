const url = require('../config')

const getSrcBearing = (imgBearings=[],typeBearing=``)=>{
  
   let [
      radail_thrust,
      radial,
      roller_radial_double_row,
      thrust]=imgBearings
      

   switch (typeBearing) {
      case `radial`:
         return `${url}Bearing/${radial}`
         break;
      case 'thrust':
         return`${url}Bearing/${thrust}`
         break;
      case'radial-thrust':
      return`${url}Bearing/${radail_thrust}`
         break;
      case 'roller radial double-row':
         return`${url}Bearing/${roller_radial_double_row}`
         break;
   
      default:return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI2uElm-QaYMpXO14WJwLqgF9elFoweeFfYA&usqp=CAU'
         break;
   }
}

module.exports=getSrcBearing