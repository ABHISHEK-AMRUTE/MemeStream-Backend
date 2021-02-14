const express = require('express')
const bodyParser = require('body-parser');
const app =express();
const mongoose = require('mongoose')
const mongooesUrl = process.env.URL || 'mongodb+srv://Abhishek:abhishekamruteonline@cluster0-b9n3j.mongodb.net/test?retryWrites=true&w=majority'
const PORT = process.env.PORT || 3000
mongoose.connect(mongooesUrl, {
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


app.post('/memes',(req,res)=>{
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
            
            res.status(500).send({
                message : "Error occured! Try again Later"
            })
        }

        else{
             if(doc.length ==0)
             {
                obj.save().then((objj)=>{
                    console.log(objj)
                    res.status(201).send({
                        message : "Posted your meme on server",
                        id: objj.id

                    })
                }).catch((e)=>{
                    res.status(500).send({
                        message : "Error in storing data",
                        error : e
                    })
                })
                
             }else{
                 res.status(406).send({
                     error:"Same record found! Are you stealling memes? LOL",
                    message : "Error occured! Already exists"
                })
             }
        }
    })

   
    
})

app.get('/memes',(req,res)=>{
    memeModel.find().sort({'id':-1}).limit(100).exec(function(error,doc){
        if(doc){
            res.status(200).send(doc);
        }
        else{
            res.status(500).send({
                message : "Error in fetching data",
                
            })
        }
    })
})


app.patch('/memes/:id',(req,res)=>{
        
        
        memeModel.updateOne({
            id:req.params.id
        },
        req.body,
        function(err,doc){
                if(err)
                {
                    res.status(500).send({
                        message : "Error while updating the meme" 
                    })
                }
                res.status(202).send({
                    message : "Reacted successfuly"
                })
        });

})

app.delete('/memes/:id',(req,res)=>{
    memeModel.deleteOne({id:req.params.id}).then(()=>{
        res.status(202).send({
            message : "Deleted The record" 
        })
    }).catch((err)=>{
        res.status(500).send({
            message : "Error in deleting to the meme",
            error: err 
        })
    })
})

app.get('/memes/:id',(req,res)=>{
    memeModel.findOne({id:req.params.id}).exec(function(err,doc){
  
         if(err){
                     res.status(500).send({
                        message : "Error in fetching the meme",
                        error: err
                     })
         }

         res.status(200).send(doc);

    })
})



app.get('/memeByName/:name',(req,res)=>{
    memeModel.find({name:req.params.name}).exec(function(err,doc){
  
         if(err){
                     res.status(500).send({
                        message : "Error in deleting to the meme",
                        error: err
                     })
         }

         res.status(200).send(doc);

    })
})


app.listen(PORT,()=>{
 console.log("servver uppppppppp.")
})