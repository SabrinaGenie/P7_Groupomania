const config = require("../Databases/database_config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, { 
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: 0,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.User = require("../models/User.js")(sequelize, Sequelize);
db.Post = require("../models/Post.js")(sequelize, Sequelize);
db.Comment = require("../models/Comments.js")(sequelize, Sequelize);
db.Like = require("../models/Like.js")(sequelize, Sequelize);


db.User.hasMany(db.Post, { onDelete: "CASCADE", });
db.User.hasMany(db.Comment, { onDelete: "CASCADE", });
db.User.hasMany(db.Like, { onDelete: "CASCADE", });
db.Post.hasMany(db.Comment, { onDelete: "CASCADE", });
db.Post.hasMany(db.Like, { onDelete: "CASCADE", });
db.Post.belongsTo(db.User, {
  foreignKey: { allowNull: false, },
  onDelete: "CASCADE",
});
db.Comment.belongsTo(db.User, {
  foreignKey: { allowNull: false, },
  onDelete: "CASCADE",
});
db.Like.belongsTo(db.User, {
  foreignKey: { allowNull: false,},
  onDelete: "CASCADE",
});
db.Comment.belongsTo(db.Post, {
  foreignKey: { allowNull: false, },
  onDelete: "CASCADE",
});
db.Like.belongsTo(db.Post, {
  foreignKey: { allowNull: false,},
  onDelete: "CASCADE",
});

module.exports = db;