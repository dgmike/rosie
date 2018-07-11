'use strict';
const { url } = require('../heplers');

module.exports = (sequelize, DataTypes) => {
  var Tag = sequelize.define('Tag', {
    slug: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});
  Tag.associate = function(models) {
    Tag.belongsToMany(models.Service, { through: 'ServiceTags' });
  };
  Tag.prototype.representation = function(req) {
    const resource = this.toJSON();
    resource.resourceType = 'Tag';

    resource._embedded = {};

    resource._links = {
      self: { href: url(req, `/tags/${this.id}`) },
      tags: { href: url(req, '/tags') },
    };

    delete(resource.ServiceTags);

    if (!Object.keys(resource._embedded).length) {
      delete(resource._embedded);
    }

    return resource;
  };
  return Tag;
};