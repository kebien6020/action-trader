
module.exports = function(sequelize, DataTypes) {
  var UserConfig = sequelize.define('UserConfig', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    poloniexApiKey: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    poloniexSecret: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    validate: {
      poloniexApiKeyAndSecretOrNone() {
        if ((this.amount === null) !== (this.amountType === null))
          throw Error('poloniexApiKey and poloniexSecret are required to both exist or both not to exist')
      },
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return UserConfig;
};
