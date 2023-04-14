//Importações
const express   = require('express');
const router    = express.Router();
const Category  = require('../categories/Category')
const Article   = require('./Article')
const slugify   = require('slugify')

//Rota que passa os artigos para a view
router.get("/admin/articles", (req, res) => {
    Article.findAll().then(articles => {
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

module.exports = router;