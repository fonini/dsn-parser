'use strict';

var DSNParser = function (dsn) {
	this.dsn = dsn || '';

	this.parts = {
		'driver': null,
		'user': null,
		'password': null,
		'host': null,
		'port': null,
		'database': null,
		'params': {}
	};

	if (this.dsn) {
		this.parse();
	}
};

DSNParser.prototype.parse = function () {
	var regexp = new RegExp(
		'^' +
			'(?:' +
			'([^:\/?#.]+)' +					// driver
			':)?' +
			'(?:\/\/' +
			'(?:([^\/?#]*)@)?' +				// auth
			'([\\w\\d\\-\\u0100-\\uffff.%]*)' +	// host
			'(?::([0-9]+))?' +					// port
			')?' +
			'([^?#]+)?' +						// database
			'(?:\\?([^#]*))?' +					// params
		'$'
	);

	var split = this.dsn.match(regexp);
	var auth = split[2].split(':');

	this.parts = {
		'driver': split[1],
		'user': auth[0] || null,
		'password': auth[1] || null, 
		'host': split[3],
		'port': split[4] ? parseInt(split[4], 10) : null,
		'database': stripLeadingSlash(split[5]),
		'params': fromQueryParams(split[6])
	};

	return this;
};

DSNParser.prototype.get = function (prop, def) {
	if (typeof(this.parts[prop]) !== 'undefined') {
		if (this.parts[prop] === null) {
			return def;
		} else {
			return this.parts[prop];
		}
	} else
	if (typeof(def) !== 'undefined') {
		return def;
	}
	
	return null;
};

DSNParser.prototype.set = function (prop, value) {
	this.parts[prop] = value;

	return this;
};

DSNParser.prototype.getDSN = function () {
	var dsn = (this.parts.driver || '') + '://'
				+ (this.parts.user || '')
				+ (this.parts.password ? ':' + this.parts.password : '') + '@'
				+ (this.parts.host || '') 
				+ (this.parts.port ? ':' + this.parts.port : '') + '/'
				+ (this.parts.database || '');

	if (this.parts.params && Object.keys(this.parts.params).length > 0) {
		dsn += '?' + toQueryParams(this.parts.params);
	}

	return dsn;
};

DSNParser.prototype.getParts = function () {
	return this.parts;
};

function fromQueryParams (params) {
	if (!params) {
		return {};
	}

	return JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
}

function toQueryParams (obj) {
	var str = [];
	for (var p in obj) {
		str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
	}
	return str.join('&');
}

function stripLeadingSlash (str) {
	if (str.substr(0, 1) === '/') {
		return str.substr(1, str.length);
	}

	return str;
}

module.exports = DSNParser;