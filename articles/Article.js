const Sequelize = require('sequelize');
const connection = require('../database/database')
const Category = require('../categories/Category')

const Article = connection.define('articles', {
    title:{ 
        type: Sequelize.STRING,
        allowNull: false,
    }, slug:{
        type: Sequelize.STRING,
        allowNull: false
    }, body :{
        type: Sequelize.STRING,
        allowNull: false
    }
})

//Relacionamento

Category.hasMany(Article)   //Uma categoria possui varios artigos
Article.belongsTo(Category) //Um artigo pertence a uma Categoria

module.exports = Article


