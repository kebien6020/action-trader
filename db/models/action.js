'use strict';
module.exports = function(sequelize, DataTypes) {
  var Action = sequelize.define('Action', {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    check: DataTypes.STRING,
    value: DataTypes.DECIMAL(20, 10),
    triggerId: DataTypes.INTEGER,
    enabled: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Action;
};
