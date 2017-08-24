
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('UserConfigs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      poloniexApiKey: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      poloniexSecret: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('UserConfigs')
  }
}
