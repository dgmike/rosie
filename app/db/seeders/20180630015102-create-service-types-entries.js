'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const now = new Date();

    return queryInterface.bulkInsert('ServiceTypes', [
      {name: 'API', slug: 'api', createdAt: now, updatedAt: now},
      {name: 'Aplication', slug: 'aplication', createdAt: now, updatedAt: now},
      {name: 'Front End Application', slug: 'front-end-application', createdAt: now, updatedAt: now},
      {name: 'Relational Database', slug: 'relational-database', createdAt: now, updatedAt: now},
      {name: 'NoSQL', slug: 'nosql', createdAt: now, updatedAt: now},
      {name: 'Message Broker', slug: 'message-broker', createdAt: now, updatedAt: now},
      {name: 'REST External Service', slug: 'rest-external-service', createdAt: now, updatedAt: now},
      {name: 'SOAP External Service', slug: 'soap-external-service', createdAt: now, updatedAt: now},
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ServiceTypes', null, {});
  }
};
