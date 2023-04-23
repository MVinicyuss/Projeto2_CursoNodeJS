const express   = require('express');
const router    = express.Router()

const bcryptjs  = require('bcryptjs')

const User      = require("./User")

router.get("/admin/users", (req, res) => {
    User.findAll().then((users) => {
        res.render("Admin/users/index", {users: users})
    })
})

router.get("/admin/users/create", (req, res) => {
    res.render("Admin/users/create")
})

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

module.exports = router