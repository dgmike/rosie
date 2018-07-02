'use strict';
const { url } = require('../heplers');

module.exports = (sequelize, DataTypes) => {
  var Service = sequelize.define('Service', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null,
      comment: 'Service name',
    },
    ServiceTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: null,
      comment: 'Associated service type',
    }
  }, {});

  Service.associate = function(models) {
    Service.belongsTo(models.ServiceType, {
      foreignKey: 'ServiceTypeId',
      onDelete: 'CASCADE',
    });
  };

  Service.prototype.representation = function (req) {
    const resource = this.toJSON();
    resource.resourceType = 'Service';

    resource._embedded = {};

    resource._links = {
      self: { href: url(req, `/services/${this.id}`) },
      services: { href: url(req, '/services') },
    };

    if (resource.ServiceType) {
      delete(resource.ServiceType);
      resource._embedded.ServiceType = this.ServiceType.representation(req);
    }

    if (!Object.keys(resource._embedded).length) {
      delete(resource._embedded);
    }

    return resource;
  };
  return Service;
};