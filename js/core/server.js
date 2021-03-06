define(function(require) {

	var _ = require('Underscore');
	var Promise = require('core/promise');
	var socket = require('core/websocket');
	socket.post = post;


	/***************
	 * HttpRequest *
	 ***************/

	function serialize(data) {
		return _.map(data, function(value, key) {
			return key + '=' + value;
		}).join('&');
	}

	function requestJson(method, url, headers, data) {
		return request(method, url, headers, data).transform(function(response) {
			return JSON.parse(response);
		});
	}

	function request(method, url, headers, data) {
		var promise = new Promise();
		var request = new XMLHttpRequest();
		request.open(method, url)

		if (headers) {
			_.each(headers, function(value, key) {
				request.setRequestHeader(key, value);
			});
		}

		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				console.log("CONTENT: " + request.responseText);
				promise.done(request.responseText);
			}
		};

		if (method === 'POST')
			request.send(serialize(data));
		else
			request.send();

		return promise.getFuture();
	}

	function get(url, headers) {
		return request('GET', url, headers, null);
	}

	function post(url, data, headers) {
		return request('POST', url, headers, data);
	}

	function json(url, data) {
		return requestJson('POST', url, null, data);
	}


	var server = {
		request: request,
		get: get,
		post: post,
		json: json
	};


	/**************************
	 * SERVER MODULES METHODS *
	 **************************/

	_.each(window.config.server, function(params, id) {
		server[id.toLowerCase()] = function() {
			return socket(id, _.object(params, arguments));
		};
	});

	return server;
});
