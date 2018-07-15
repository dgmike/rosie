'use strict';
const Chance = require('chance');

const chance = Chance();

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { sequelize } = queryInterface;
    const date = new Date();
    const initial = 10;

    const query = sequelize.query.bind(
      sequelize,
      `SELECT \`id\` FROM \`Services\` ORDER BY RAND() LIMIT ${initial}`,
      {
        type: Sequelize.QueryTypes.SELECT
      }
    );

    return Promise.all(Array(initial + 1).fill(query).map(e => e()))
      .then(results => results.map(result => result.map(item => item.id)))
      .then(results => [results[0], results.slice(1)])
      .then(([dependents, dependencies]) => dependents.reduce((sum, cur, index) => {
        const dependent = dependents[index];
        const dependency = dependencies[index];

        sum.push(
          dependency
            .filter(dep => dep !== dependent)
            .map(dep => ({
              DependentId: dependent,
              DependencyId: dep,
              createdAt: date,
              updatedAt: date,
            }))
        );

        return sum;
      }, []))
      .then(arrays => [].concat.apply([], arrays))
      .then(data => queryInterface.bulkInsert('ServiceDependencies', data));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ServiceDependencies', null, {});
  }
};
