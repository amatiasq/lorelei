var Logger = require('./logger');
var socket = require('./socket');

require('fs').readdir('server/handlers', function(error, files) {
	if (error) {
		console.error(error);
		return;
	}

	var handlers = {};
	var modules = {}
	files.forEach(function(file) {
		if (file.substr(-3) !== '.js')
			return;

		var module = require('./handlers/' + file);
		handlers[module.id] = module.handler;
		modules[module.id] = module.params;
	});

	socket(function(id, connection) {
		Logger.info(id, null, 'CONNECTED');

		var init = JSON.stringify({ requestId: null, modules: modules });
		Logger.info(id, null, 'ANSWER', init);
		connection.sendUTF(init);

		connection.on('message', function(event) {
			if (event.type !== 'utf8') return
			var data = JSON.parse(event.utf8Data);

			Logger.info(id, data.requestId, 'RECIVED', event.utf8Data);

			handlers[data.type](data.data, function(error, response) {
				var json = JSON.stringify({
					requestId: data.requestId,
					success: !error,
					content: response || undefined,
					error: error || undefined
				});

				if (error)
					Logger.error(id, data.requestId, 'FAILED', error.message);
				else
					Logger.info(id, data.requestId, 'SUCCESS', json);

				connection.sendUTF(json);
			});
		});
	});
});