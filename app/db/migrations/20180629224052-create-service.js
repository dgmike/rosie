'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('Services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ServiceTypeId: {
        type: Sequelize.INTEGER.UNSIGNED,
        onDelete: 'CASCADE',
        references: {
          model: 'ServiceTypes',
          key: 'id'
        }
      },
      source: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT
      },
      registered: {
        type: Sequelize.BOOLEAN,
        comment: 'Defines if it is registered on system or just created by required dependency',
        default: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    queryInterface.addConstraint('Services', ['slug'], {
      type: 'unique',
      name: 'slug_unique_key'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Services');
  }
};
