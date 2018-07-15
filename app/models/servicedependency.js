'use strict';
module.exports = (sequelize, DataTypes) => {
  var ServiceDependency = sequelize.define('ServiceDependency', {
    DependentId: {
      type: DataTypes.STRING,
      references: {
        model: 'Service',
        key: 'id',
      },
    },
    DependencyId: {
      type: DataTypes.STRING,
      references: {
        model: 'Service',
        key: 'id',
      },
    },
  }, {});

  ServiceDependency.associate = function(models) {
    ServiceDependency.hasMany(models.Service, { foreignKey: 'id', targetKey: 'DependentId', as: 'Dependencies' });
    ServiceDependency.hasMany(models.Service, { foreignKey: 'id', targetKey: 'DependencyId', as: 'Dependents' });
  };
  return ServiceDependency;
};
