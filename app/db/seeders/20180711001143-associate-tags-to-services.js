'use strict';
const Chance = require('chance');

const chance = Chance();

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { sequelize } = queryInterface;
    const date = new Date();
    const natural = chance.natural.bind(chance, {min: 1, max: 10});

    return Promise
      .all([
        sequelize.query('SELECT `id` FROM `Services` LIMIT 5', { type: Sequelize.QueryTypes.SELECT }),
        sequelize.query('SELECT `id` FROM `Tags` LIMIT 20', { type: Sequelize.QueryTypes.SELECT }),
      ])
      .then(([services, tags]) => (
        {
          services: services.map(service => service.id),
          tags: tags.map(tag => tag.id)
        }
      ))
      .then(({services, tags}) => ({
        tags,
        services: services.map(service => ({service, tagCount: natural()})),
      }))
      .then(({ services, tags }) => {
        return services.map((service) => {
          return chance.pickset(tags.slice(), service.tagCount)
            .map(tag => ({TagId: tag, ServiceId: service.service, createdAt: date, updatedAt: date}))
        });
      })
      .then((results) => {
        return results.reduce((sum, cur) => {
          cur.forEach(e => sum.push(e)); return sum;
        }, []);
      })
      .then((data) => {
        console.log(data)
        return queryInterface.bulkInsert('ServiceTags', data);
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ServiceTags', null, {});
  }
};
