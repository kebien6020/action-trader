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
    },
    amount: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: true,
      defaultValue: null,
      validate: {
        min: 0,
      }
    },
    amountType: {
      type: DataTypes.ENUM('percentage', 'absolute'),
      allowNull: true,
      defaultValue: null,
    }
  }, {
    validate: {
      amountAndTypeOrNone() {
        if ((this.amount === null) !== (this.amountType === null))
          throw Error('amount and amountType are required to both exist or both not to exist')
      },
      buyAndSellRequireAmount() {
        if (this.type === 'sell' || this.type === 'buy')
          if (this.amount === null)
            throw Error('sell and buy actions require an amount')
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Action;
};
