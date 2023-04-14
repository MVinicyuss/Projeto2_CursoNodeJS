//Importações
const express = require('express');
const app = express();

//Ativando Body Parser
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended: 'false'})); // to support URL-encoded bodies

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

//Rotas
app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req, res) => {
    res.render("index")
})

// Porta do servidor
app.listen(8080, () => {
    console.log("Servidor rodando")
})