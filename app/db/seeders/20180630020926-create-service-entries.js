'use strict';
const Chance = require('chance');

const chance = Chance();

module.exports = {
  up: (queryInterface, Sequelize) => {
    const now = new Date;

    return queryInterface.sequelize
      .query('SELECT * FROM `ServiceTypes`', { type: Sequelize.QueryTypes.SELECT })
      .then((result) => {
        return result.map((item) => {
          return new Array(chance.natural({ min: 0, max: 10 })).fill(true)
            .map(() => {
              return {
                name: chance.city(),
                description: chance.paragraph(),
                source: 'https://gitlab.devel/x-force/project',
                serviceTypeId: item.id,
                createdAt: now,
                updatedAt: now,
              };
            })
        });
      })
      .then((arrays) => {
        return arrays.reduce((current, item) => {
          item.forEach(elm => current.push(elm));
          return current;
        }, []);
      })
      .then((insertData) => {
        return queryInterface.bulkInsert('Services', insertData);
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Services', null, {});
  }
};
