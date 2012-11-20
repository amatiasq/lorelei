define(function(require) {

	var $ = require('$');
	var Presenter = require('presenter');
	var lorelei = require('provider/lorelei')

	var providers = {
		'lorelei': lorelei
	};

	function Notes(provider, parent) {
		this.presenter = new Presenter(providers[provider]);
		this.presenter.render(parent);
	}

	return Notes;
});