DSN Parser for Node
===================

Parse and create database connection strings fluently.

## Installation

`npm install dsn-parser`

## Usage

### Parse Data Source Name

````js
var DSNParser = require('dsn-parser');

var dsn = new DSNParser('pgsql://user:pass@127.0.0.1:5432/my_db?sslmode=verify-full&application_name=myapp');
dsn.getParts();

/*
{ 
  driver: 'pgsql',
  user: 'user',
  password: 'pass',
  host: '127.0.0.1',
  port: 5432,
  database: 'my_db',
  params: { sslmode: 'verify-full', application_name: 'myapp' } 
} */

dsn.get('database'); // my_db
dsn.get('host'); // 127.0.0.1

dsn.set('driver', 'mysql');
dsn.set('user', 'root');
dsn.set('password', null);
dsn.set('port', 3306);
dsn.set('params', null);

dsn.getDSN();
// mysql://root@127.0.0.1:3306/my_db

````

### Build new DSN

````js
var DSNParser = require('dsn-parser');

dsn.set('driver', 'mysql')
	.set('user', 'root')
	.set('password', 'mypass')
	.set('host', 'localhost')
	.set('port', 3306)
	.set('database', '7gh4d78sh2')
	.set('params', {
		charset: 'utf8',
		strict: true
	});

dsn.getDSN();

// mysql://root:mypass@localhost:3306/7gh4d78sh2?charset=utf8&strict=true
````

## Run tests

`npm test`

## Author

#### Jonnas Fonini

- https://fonini.github.io

## License
[![Licensed under the WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-2.png "Licensed under the WTFPL")](http://www.wtfpl.net)