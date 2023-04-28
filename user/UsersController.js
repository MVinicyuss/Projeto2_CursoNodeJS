const express   = require('express');
const router    = express.Router()

const bcryptjs  = require('bcryptjs')

const User      = require("./User");
const adminAuth = require('../middlewares/adminAuth');

router.get("/admin/users", (req, res) => {
    User.findAll().then((users) => {
        res.render("Admin/users/index", {users: users})
    })
})

router.get("/admin/users/create", (req, res) => {
    res.render("Admin/users/create")
})

//Criação de usuario
router.post("/users/create", (req, res) => {
    let {email, password} = req.body

    User.findOne({
        where:{
            email: email
        }
    }).then( user => {
        if(user == undefined){
        
            let salt    = bcryptjs.genSaltSync(10);    
            let hash    = bcryptjs.hashSync(password, salt)
        
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch((error) => {
                res.redirect("/")
            })

        }else{
            res.redirect("/admin/users/create")
        }
    })
})

router.get("/login", (req, res) => {
    res.render("Admin/users/login")
})

router.post("/authenticate", (req, res) => {
    let {email, password} = req.body

    User.findOne({
        where:{
            email
        }
    }).then((user) => {
        if(user != undefined){
            let correct = bcryptjs.compareSync(password, user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email,              
                }
                res.redirect("/admin/articles")
            }else{
                res.redirect("/login");
            }
        }else{
            res.redirect("/login");
        }
    })
})

router.get("/logout", adminAuth, (req, res) => {
    req.session.user = undefined;
    res.redirect("/")
})

module.exports = router