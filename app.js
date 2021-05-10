const express = require("express")
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('static'));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

app.listen(port, () => {
    console.log(`localhost:${port}`);
})

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

/////////////////Requests for all the articles///////////////////////////
app.route("/articles")
    .get((req, res) => {
        Article.find(function (err, foundArticles) {
            if (!err) res.send(foundArticles);
            else res.send(err);
        })
    })

    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err) => {
            if (!err) res.send("successfully added new article");
            else res.send(err);
        });
    })

    .delete((req, res) => {
        Article.deleteMany(function (err) {
            if (!err) res.send("successfully deleted all articles");
            else res.send(err);
        });
    });

/////////////////Requests for specific articlse///////////////////////////

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle },
            function (err, foundArticle) {
                if (!err) {
                    if (foundArticle) res.send(foundArticle);
                    else res.send("Not found");
                }
                else res.send(err);
            });
    })
    .put((req, res) => {
        Article.update(
            { title: req.params.articleTitle },
            {
                title: req.body.title,
                content: req.body.content
            },
            { overwrite: true },
            function (err) {
                if (!err) res.send("Successfully updated");
                else res.send(err);
            }
        )
    })
    .patch((req, res) => {
        Article.update(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) res.send("Successfully updated");
                else res.send(err);
            }
        );
    })
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle },
            function (err) {
                if (!err) res.send("successfully deleted article");
                else res.send(err);
            });
    });