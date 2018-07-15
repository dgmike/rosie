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
              const name = chance.city();
              const project = [
                'crmintegration/middleware',
                'crmintegration/queueprocessor',
                'crmintegration/scheduler',
                'x-force/oprah',
                'x-force/api-product',
                'x-force/api-empresas',
                'x-force/apis-usuarios',
                'x-force/apis-contracts',
                'x-force/api_vaga',
              ];

              return {
                name,
                slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                description: chance.paragraph(),
                source: `https://gitlab.devel/${chance.pick(project)}`,
                serviceTypeId: item.id,
                registered: true,
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
