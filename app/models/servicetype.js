'use strict';
module.exports = (sequelize, DataTypes) => {
  var ServiceType = sequelize.define('ServiceType', {
    name: DataTypes.STRING,
    slug: DataTypes.STRING
  }, {});
  ServiceType.associate = function(models) {
    ServiceType.hasMany(models.Service, {
      foreignKey: 'ServiceTypeId',
      onDelete: 'CASCADE',
    })
    // associations can be defined here
  };
  return ServiceType;
};