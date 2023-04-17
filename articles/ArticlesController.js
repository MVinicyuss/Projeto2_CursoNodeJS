//Importações
const express   = require('express');
const router    = express.Router();
const Category  = require('../categories/Category')
const Article   = require('./Article')
const slugify   = require('slugify')

//Rota que passa os artigos para a view
router.get("/admin/articles", (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    })
    .then(articles => {
        res.render("admin/articles/index", {article: articles})
    })
})

//Rota de acessar pagina de criação de artigos
router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(category => {
        res.render("admin/articles/new", {category: category})
    })
})

//Rota de Salvar Artigos
router.post("/admin/articles/save", (req, res) => {
    let title = req.body.title
    let body  = req.body.body
    let category = req.body.category

    Article.create({
        title: title,
        body: body,
        slug: slugify(title),
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    })
})

//Rota de Deletar Artgios
router.post("/articles/delete", (req, res) => {
    let id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){     //é um numero?
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })
        }else{
            res.redirect("/admin/articles")
        }
    }else{
        res.redirect("/admin/articles")
    }
})

//Rota da pegina de edição de artigo
router.get("/admin/articles/edit/:id", (req, res) => {
    let id = req.params.id

    if(isNaN(id)){
        res.redirect("/admin/articles")
    }

    Article.findByPk(id)
    .then(article => {
        if(article != undefined){  

            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {article: article, categories: categories})

            })
            
        }else{
            res.redirect("/admin/articles")
        }
    }).catch(erro => {
        res.redirect("/admin/articles")
    })
})

//Rota para salvar a edição
router.post("/articles/update", (req, res) => {
    let id      = req.body.id
    let title   = req.body.title
    let body    = req.body.body
    let category    = req.body.category

    Article.update({title: title, slug: slugify(title), body: body, categoryId: category}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(err => {
        res.redirect("/admin/articles")
    })
})

//Rota de paginação
router.get("/articles/page/:num", (req, res) => {
    let page    = req.params.num;
    let offset  = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = 4 * parseInt(page)
    }

    Article.findAndCountAll({
        limit: 3,
        offset: offset
    }).then(articles => {

        let next;
        if(offset + 4 >= articles.count){
            next = false
        }else{
            next = true
        }

        let result = {
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})
        })
    })

})

module.exports = router;