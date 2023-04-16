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
    Article.findAll({
        order:[
            ['id', 'DESC']
        ]
    }).then(articles => {
        Category.findAll().then(categories =>{
            res.render("index", {articles: articles, categories: categories})
        })
    })
})

app.get("/:slug", (req, res) => {
    let slug = req.params.slug
    Article.findOne({
        where:{
            slug: slug
        }
    }).then(articles => {
        if(articles != undefined){
            Category.findAll().then(categories =>{
                res.render("article", {articles: articles, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch( err => {
        res.redirect("/")
    })
})
//Renderizando os artigos de uma categoria
app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{
            model: Article
        }]
    }).then(category => {
        if(category != undefined){
            
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories})
            })

        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

// Porta do servidor
app.listen(8080, () => {
    console.log("Servidor rodando")
})