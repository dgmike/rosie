Rosie
-----

To install run migrations:

```
$ docker-compose up -d
... wait
$ docker-compose exec app sequelize db:migrate
$ docker-compose exec app sequelize db:seed:all
```
