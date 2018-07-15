'use strict';
const superagent = require('superagent');
const { url } = require('../heplers');

module.exports = (sequelize, DataTypes) => {
  var Service = sequelize.define('Service', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null,
      comment: 'Service name',
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null,
      comment: 'Slug of service',
    },
    ServiceTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: null,
      comment: 'Associated service type',
    },
    source: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
  }, {});

  Service.associate = function(models) {
    Service.belongsTo(models.ServiceType, {
      foreignKey: 'ServiceTypeId',
      onDelete: 'CASCADE',
    });
    Service.belongsToMany(models.Tag, { through: 'ServiceTags' });

    Service.belongsToMany(
      Service,
      {
        as: 'Dependencies',
        through: {
          model: models.ServiceDependency,
          unique: false,
        },
        foreignKey: 'DependentId',
        otherKey: 'DependencyId',
      }
    );
    Service.belongsToMany(
      Service,
      {
        as: 'Dependents',
        through: {
          model: models.ServiceDependency,
          unique: false,
        },
        foreignKey: 'DependencyId',
        otherKey: 'DependentId',
      }
    );
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

    if (resource.Tags) {
      delete(resource.Tags);
      resource._embedded.Tags = this.Tags.map(tag => tag.representation(req));
    }

    if (resource.Dependencies) {
      delete(resource.Dependencies);
      resource._embedded.Dependencies = this.Dependencies.map(dependency => dependency.representation(req));
    }

    if (resource.ServiceDependencies) {
      delete(resource.ServiceDependencies);
    }

    if (!Object.keys(resource._embedded).length) {
      delete(resource._embedded);
    }

    return resource;
  };

  Service.prototype.getFiles = async function() {
    const promises = [];

    if (!this.source) {
      return {};
    }

    // const source = this.source.trim().replace(/^\/|\/$/g, '');
    // const source = 'http://michaelgranados:5053dv@gitlab.devel/x-force/oprah'
    const source = 'http://gitlab.devel/x-force/oprah'
    // const source = 'https://gitlab.com/empurrandojuntos/frontend';

    promises.push(superagent.get(`${source}/raw/master/README.md`).auth('michaelgranados', '5053dv').catch(err => err));
    promises.push(superagent.get(`${source}/raw/master/Dockerfile`).auth('michaelgranados', '5053dv').catch(err => err));
    promises.push(superagent.get(`${source}/raw/master/docker-compose.yml`).auth('michaelgranados', '5053dv').catch(err => err));
    promises.push(superagent.get(`${source}/raw/master/Jenkinsfile`).auth('michaelgranados', '5053dv').catch(err => err));

    // return Promise.all(promises);
    return Promise.all(promises).then(results => results.filter(result => result.ok));
  };

  return Service;
};
