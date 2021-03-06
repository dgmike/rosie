'use strict';
const { url } = require('../heplers');

module.exports = (sequelize, DataTypes) => {
  var ServiceType = sequelize.define('ServiceType', {
    name: {
      type: DataTypes.STRING,
      required: true,
    },
    slug: {
      type: DataTypes.STRING,
      required: true,
    },
  }, {});

  ServiceType.associate = function(models) {
    ServiceType.hasMany(models.Service, {
      foreignKey: 'ServiceTypeId',
      onDelete: 'CASCADE',
    })
  };

  ServiceType.prototype.representation = function (req) {
    const resource = this.toJSON();
    resource.resourceType = 'ServiceType';

    resource._embedded = {};

    resource._links = {
      self: { href: url(req, `/service-types/${this.id}`) },
      serviceTypes: { href: url(req, '/service-types') },
    };

    if (!Object.keys(resource._embedded).length) {
      delete(resource._embedded);
    }

    return resource;
  }

  return ServiceType;
};