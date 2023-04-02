const express = require('express');
const app = express();

//Setando as viwes
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render("index")
})



app.listen(8080, () => {
    console.log("Servidor rodando")
})