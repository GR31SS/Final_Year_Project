let Sequelize = require('sequelize')
let DataTypes = Sequelize.DataTypes

let db = {}

function configure (host, user, password, database) {
  return new Promise((resolve) => {
    console.log(user)
    // Prepare the Sequelize instance
    let sequelize = new Sequelize({
      host: host,
      database: database,
      username: user,
      password: password,
      dialect: 'mysql',
      operatorsAliases: false,

      define: {
        freezeTableName: true,
        timestamps: false
      },

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
    // Require Models
    let UserModel = require('./models/user')(sequelize, DataTypes)
    // Add the models
    db.user = UserModel
    // TODO: Add any associations here
    // Set the db Sequelize instance
    db.sequelize = sequelize
    db.Sequelize = Sequelize
    resolve()
  })
}

function getDatabase () {
  return db
}

module.exports = {
  configure,
  getDatabase
}