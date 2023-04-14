//Importações
const express   = require('express');
const router    = express.Router();
const Category  = require('./Category')
const slugify   = require('slugify')

router.get("/admin/categories/new", (req, res) => {
    res.render('../views/Admin/categories/new')
})

//Salvando nova Categoria
router.post("/categories/save", (req, res) => {
    let title = req.body.title
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories")
        })
    }else{
        res.redirect("/admin/categories/new")
    }
})

//Acessando a lista de categorias
router.get("/admin/categories", (req, res) => {
    Category.findAll().then(category => {
        res.render("admin/categories/index", {category: category})
    })
})

//Deletando uma categoria
router.post("/categories/delete", (req, res) => {
    let id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){     //é um numero?
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories")
            })
        }else{
            res.redirect("/admin/categories")
        }
    }else{
        res.redirect("/admin/categories")
    }
})

//Acesso a pagina para editar o nome da categoria
router.get("/admin/categories/edit/:id", (req, res) => {
    let id = req.params.id

    if(isNaN(id)){
        res.redirect("/admin/categories")
    }

    Category.findByPk(id)
    .then(category => {
        if(category != undefined){  
            res.render("admin/categories/edit", {category: category})
        }else{
            res.redirect("/admin/categories")
        }
    }).catch(erro => {
        res.redirect("/admin/categories")
    })
})

//Editando o nome da categoria
router.post("/categories/update", (req, res) => {
    let id      = req.body.id
    let title   = req.body.title

    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})

module.exports = router;