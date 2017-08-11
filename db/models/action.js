'use strict';
module.exports = function(sequelize, DataTypes) {
  var Action = sequelize.define('Action', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['sell', 'buy', 'enable', 'disable']]
      }
    },
    check: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['gt', 'lt']]
      }
    },
    value: {
      type: DataTypes.DECIMAL(20, 10),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    triggerName: DataTypes.STRING,
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Action;
};
