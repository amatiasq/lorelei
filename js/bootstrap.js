(function() {

	var config = {
		context: 'core',
		baseUrl: 'js',
		enforceDefine: true,

		// To bypass browser cache uncomment this...
		//urlArgs: "bust=" +  (new Date()).getTime(),

		paths: {
			'vendor': 'vendor',
			'core': 'core',
			'tmpl': 'tmpl',
			'css': 'css',

			'$': 'vendor/jquery',
			'Underscore': 'vendor/underscore',
		},

		shim: {
			'$': {
				'exports': '$'
			},

			'Underscore': {
				'exports': '_'
			}
		}
	};

	require.config(config)([ '../js/main' ], function(main) {
		setTimeout(function() {
			main.init(config);
		}, 1000);
	});

})();


function debug(key, moduleName) {
	require([moduleName], function(module) {
		window[key] = module
	})
}

