'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'ServiceDependencies',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER.UNSIGNED,
        },
        DependentId: {
          allowNull: false,
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'Services',
            key: 'id',
          },
        },
        DependencyId: {
          allowNull: false,
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'Services',
            key: 'id',
          },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
      }
    );

    queryInterface.addConstraint('ServiceTypes', ['DependentId', 'DependencyId'], {
      type: 'unique',
      name: 'dependent_dependency_unique_key'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ServiceDependencies');
  }
};
