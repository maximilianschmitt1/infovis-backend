# infovis backend

## Dependencies

* [Install VirtualBox](https://www.virtualbox.org/wiki/Downloads)
* [Install Vagrant](https://www.vagrantup.com/)

## Setup

```
$ git clone https://github.com/maximilianschmitt1/infovis-backend
$ cd infovis-backend
$ vagrant up
$ vagrant ssh
$ cd /var/www/app
$ npm install
$ knex migrate:latest
```

## Start

```
$ vagrant up
$ vagrant ssh
$ cd /var/www/app
$ node main
```

## Seeding

Do all of the following on the server, so make sure to `vagrant ssh` first.

### Faculties and courses

Data analysis scripts from [maximilianschmitt1/infovis-data-analysis](https://github.com/maximilianschmitt1/infovis-data-analysis).

```
$ ../data-analysis/crawl-categories-courses | ../data-analysis/faculties-courses | data/faculties.json
$ cat data/faculties.json | ./bin/import-faculties
$ cat data/faculties.json | ./bin/import-courses
```

### Hits from GRIPS log

Takes multiple hours to run:

```
$ cat data/grips-log.csv | ./bin/import-hits
```
