//Importações
const express = require('express');
const app = express();

const session = require('express-session')

//Ativando Body Parser
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended: 'false'})); // to support URL-encoded bodies

//Ativando Sessions
app.use(session({
    secret: "asdijadowqdbmnmn%4126(%$)(_",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 30000
    }
}))

const connection            = require('./database/database');

const categoriesController  = require('./categories/CategoriesController');
const articlesController    = require('./articles/ArticlesController');
const usersController    = require('./user/UsersController');

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./user/User')


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
app.use("/", usersController);

app.get("/", (req, res) => {
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 4
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

//Rota de SESSIONS
app.get("/admin/session", (req, res) => {
    req.session.treinamento = "Formação nodejs"
    req.session.ano = "2023"
    req.session.email = "testea%@gmail.com"
    req.session.user = {
        username: "Teste",
        id: 23
    }
    res.send("Sessão gerada")
})

app.get("/admin/leitura", (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email
    })
})


// Porta do servidor
app.listen(8080, () => {
    console.log("Servidor rodando")
})