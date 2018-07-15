'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ServiceTags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      ServiceId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      TagId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });

    queryInterface.addConstraint('ServiceTags', ['ServiceId', 'TagId'], {
      type: 'unique',
      name: 'service_tag_unique_key'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ServiceTags');
  }
};