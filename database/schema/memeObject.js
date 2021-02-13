const mongoose = require('mongoose')

const  memeSchema = new mongoose.Schema({
      name : {
          type : String,
          required : true,
          trim  : true
     },
     caption : {
        type : String,
        required : true,
        trim  : true
     },
     url :{
         type: String,
         required : true,
         trim : true
     },
     id :{
         type: Number,
         required : true,
         
     },
     reactions:{
         type:Number,
         required:true
     }

});



const memeModel = mongoose.model('memeSchema',memeSchema)
module.exports= memeModel