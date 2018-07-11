'use strict';
module.exports = (sequelize, DataTypes) => {
  var ServiceTag = sequelize.define('ServiceTag', {
    ServiceId: DataTypes.INTEGER,
    TagId: DataTypes.INTEGER
  }, {});
  ServiceTag.associate = function(models) {
    // associations can be defined here
  };
  return ServiceTag;
};