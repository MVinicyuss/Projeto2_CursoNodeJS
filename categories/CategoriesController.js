//Importações
const express = require('express');
const router = express.Router();

router.get("/admin/categories/new", (req, res) => {
    res.render('../views/Admin/categories/new.ejs')
})

module.exports = router;