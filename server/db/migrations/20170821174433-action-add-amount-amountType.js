'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Actions', 'amount', {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: true,
        defaultValue: null,
      }),
      queryInterface.addColumn('Actions', 'amountType', {
        type: Sequelize.ENUM('percentage', 'absolute'),
        allowNull: true,
        defaultValue: null,
      })
    ])
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Actions', 'amount'),
      queryInterface.removeColumn('Actions', 'amountType')
    ])
  }
};
