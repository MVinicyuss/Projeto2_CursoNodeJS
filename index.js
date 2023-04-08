//Importações
const express = require('express');
const app = express();

const connection            = require('./database/database');

const categoriesController  = require('./categories/CategoriesController');
const articlesController    = require('./articles/ArticlesController');

const Article = require('./articles/Article')
const Category = require('./categories/Category')


//Setando as viwes
app.set('view engine', 'ejs');

//Setando arquivos estaticos
app.set(express.static('public'));

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso")
    }).catch((error) => {
        console.log(error)
    })

//
app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req, res) => {
    res.render("index")
})



app.listen(8080, () => {
    console.log("Servidor rodando")
})