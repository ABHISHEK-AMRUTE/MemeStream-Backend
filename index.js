const express = require('express')
const bodyParser = require('body-parser');
const app =express();
const mongoose = require('mongoose')

mongoose.connect(process.env.URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const memeModel = require('./database/schema/memeObject');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PATCH,GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.post('/meme',(req,res)=>{
    console.log(req.body.name, req.body.caption , req.body.url)
    
    var obj = new memeModel({
        name : req.body.name,
        caption : req.body.caption,
        url : req.body.url,
        reactions: req.body.reactions,
        id :  Date.now()
    })
   
    memeModel.find({
        name : req.body.name,
        caption : req.body.caption,
        url : req.body.url
       
    }).exec(function(err,doc){
        if(err){
            
            res.send({
                message : "Error occured! Try again Later"
            })
        }

        else{
             if(doc.length ==0)
             {
                obj.save().then((objj)=>{
                    console.log(objj)
                    res.send({
                        message : "Posted your meme on server",
                        id: objj.id

                    })
                }).catch((e)=>{
                    res.send({
                        message : "Error in storing data",
                        error : e
                    })
                })
                
             }else{
                 res.send({
                    message : "Error occured! Already exists"
                })
             }
        }
    })

   
    
})

app.get('/meme',(req,res)=>{
    memeModel.find().exec(function(error,doc){
        if(doc){
            res.send(doc);
        }
        else{
            res.send({
                message : "Error in fetching data",
                
            })
        }
    })
})


app.patch('/meme/:id',(req,res)=>{
        
        
        memeModel.updateOne({
            id:req.params.id
        },
        req.body,
        function(err,doc){
                if(err)
                {
                    res.send({
                        message : "Error while updating the meme" 
                    })
                }
                res.send({
                    message : "Reacted successfuly"
                })
        });

})

app.delete('/meme/:id',(req,res)=>{
    memeModel.deleteOne({id:req.params.id}).then(()=>{
        res.send({
            message : "Deleted The record" 
        })
    }).catch((err)=>{
        res.send({
            message : "Error in deleting to the meme",
            error: err 
        })
    })
})

app.get('/meme/:id',(req,res)=>{
    memeModel.findOne({id:req.params.id}).exec(function(err,doc){
  
         if(err){
                     res.send({
                        message : "Error in deleting to the meme",
                        error: err
                     })
         }

         res.send(doc);

    })
})



app.get('/memeByName/:name',(req,res)=>{
    memeModel.find({name:req.params.name}).exec(function(err,doc){
  
         if(err){
                     res.send({
                        message : "Error in deleting to the meme",
                        error: err
                     })
         }

         res.send(doc);

    })
})


app.listen(process.env.PORT,()=>{
 console.log("servver uppppppppp.")
})