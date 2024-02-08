const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const User = require('./user');
const Post = require('./post');
const Hasgtag = require('./hashtag');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hasgtag = Hasgtag;

User.init(sequelize);
Post.init(sequelize);
Hasgtag.init(sequelize);

User.associate(db);
Post.associate(db);
Hasgtag.associate(db);

module.exports = db;
