'use strict';
module.exports = function(sequelize, DataTypes) {
  var subscription = sequelize.define('Subscription', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return subscription;
};
