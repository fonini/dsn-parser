'use strict';

var expect = require('chai').expect;
var DSNParser = require('../index.js');

describe('#DSNParser', function () {
	it('should parse correct values', function () {
		var dsn = new DSNParser('pgsql://user:pass@127.0.0.1:5432/my_db?sslmode=verify-full&application_name=myapp');

		expect(dsn.get('driver')).to.equal('pgsql');
		expect(dsn.get('user')).to.equal('user');
		expect(dsn.get('password')).to.equal('pass');
		expect(dsn.get('host')).to.equal('127.0.0.1');
		expect(dsn.get('database')).to.equal('my_db');
		expect(dsn.get('port')).to.equal(5432);
		expect(dsn.get('params').sslmode).to.equal('verify-full');
		expect(dsn.get('params').application_name).to.equal('myapp');
	});

	it('should get default port', function () {
		var dsn = new DSNParser('pgsql://user:pass@127.0.0.1/my_db');
		expect(dsn.get('port', 5432)).to.equal(5432);
	});

	it('should remove password', function () {
		var dsn = new DSNParser('mysql://user:pass@127.0.0.1/my_db');
		dsn.set('password', null);

		expect(dsn.getDSN()).to.equal('mysql://user@127.0.0.1/my_db');
	});

	it('should fluently build DSN from scratch', function () {
		var dsn = new DSNParser();

		dsn.set('driver', 'mysql').set('user', 'root').set('password', 'mypass').set('host', 'localhost')
			.set('port', 3306).set('database', '7gh4d78sh2').set('params', {charset: 'utf8', strict: true});

		expect(dsn.getDSN()).to.equal('mysql://root:mypass@localhost:3306/7gh4d78sh2?charset=utf8&strict=true');
	});

	it('should parts be correctly returned', function () {
		var dsn = new DSNParser('mysql://root@localhost/dbname');

		expect(dsn.getParts()).deep.equal({driver: 'mysql',
			user: 'root',
			password: null,
			host: 'localhost',
			port: null,
			database: 'dbname',
			params: {}
		});
	});

	it('should change database name and add another parameter', function () {
		var dsn = new DSNParser('pgsql://user:pass@127.0.0.1:5432/my_db?sslmode=verify-full');

		dsn.set('database', 'another_db');

		var params = dsn.get('params');
		params.application_name = 'myapp';

		dsn.set('params', params);

		expect(dsn.getDSN()).to.equal('pgsql://user:pass@127.0.0.1:5432/another_db?sslmode=verify-full&application_name=myapp');
	});
});