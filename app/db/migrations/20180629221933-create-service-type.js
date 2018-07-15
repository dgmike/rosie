'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('ServiceTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      slug: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    queryInterface.addConstraint('ServiceTypes', ['slug'], {
      type: 'unique',
      name: 'slug_unique_key'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ServiceTypes');
  }
};