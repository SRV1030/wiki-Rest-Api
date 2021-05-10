const express= require("express")
const bodyParser= require("body-parser");
const ejs= require("ejs");
const mongoose= require("mongoose");
const app=express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('static'));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

app.listen(port,()=>{
    console.log(`localhost:${port}`);
})

const articleSchema= new mongoose.Schema({
    title:String,
    content:String
});

const Article= mongoose.model('Article',articleSchema);

app.get("/articles",(req,res)=>{
    Article.find(function(err,foundArticles){
        if(!err)res.send(foundArticles);
        else res.send(err);
    })
})

app.post("/articles",(req,res)=>{
    const newArticle= new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save((err)=>{
        if(!err)res.send("success");
        else res.send(err);
    });
})