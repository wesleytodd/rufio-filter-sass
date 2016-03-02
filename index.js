var through2 = require('through2');
var sass = require('node-sass');

module.exports = function createSassFilter (opts) {
	opts = opts || {};
	opts.sass = opts.sass || {};

	return function sassFilter (item) {
		var _content = '';
		return through2(function (chunk, enc, done) {
			_content += chunk;
			done();
		}, function (done) {
			sass.render(Object.assign({}, opts.sass, {
				data: _content,
				includePaths: [].concat(opts.sass.includePaths || [], item.absDirname)
			}), function (err, parsed) {
				if (err) {
					return done(err);
				}

				this.push(parsed.css);
				done();
			}.bind(this));
		});
	};
};
