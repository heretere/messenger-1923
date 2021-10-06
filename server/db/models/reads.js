const db = require("../db");
const Sequelize = require("sequelize");

const Reads = db.define("reads", {
  read: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Reads;
