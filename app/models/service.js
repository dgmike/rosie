'use strict';
module.exports = (sequelize, DataTypes) => {
  var Service = sequelize.define('Service', {
    name: DataTypes.STRING
  }, {});
  Service.associate = function(models) {
    Service.belongsTo(models.ServiceType, {
      foreignKey: 'ServiceTypeId',
      onDelete: 'CASCADE',
    });
    // associations can be defined here
  };
  return Service;
};