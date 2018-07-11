'use strict';
const Chance = require('chance');

const chance = Chance();

module.exports = {
  up: (queryInterface, Sequelize) => {
    const date = new Date();

    chance.mixin({
      tagResource() {
        const name = chance.name();
        return {
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          createdAt: date,
          updatedAt: date,
        };
      }
    });

    const tags = Array(chance.natural({ min: 1, max: 30 })).fill(true).map(chance.tagResource);
    return queryInterface.bulkInsert('Tags', tags, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tags', null, {});
  }
};
