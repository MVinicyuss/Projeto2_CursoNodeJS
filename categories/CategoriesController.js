//Importações
const express = require('express');
const router = express.Router();

const Category = require('./Category')
const slugify = require('slugify')

router.get("/admin/categories/new", (req, res) => {
    res.render('../views/Admin/categories/new.ejs')
})

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

router.get("/admin/categories", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/index.ejs", {categories: categories})
    })
})

router.post("/categories/delete", (req, res) => {
    var id = req.body.id
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

router.get("/admin/categories/edit:id", (req, res) => {
    let id = req.params.id
    Category.findByPk(id).
    then(categoria => {
        if(categoria != undefined){
            
            

        }else{
            res.redirect("/admin/categories")
        }
    }).catch(erro => {
        res.redirect("/admin/categories")
    })
})

module.exports = router;