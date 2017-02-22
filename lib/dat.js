'use strict';var _datNode = require('dat-node');var _datNode2 = _interopRequireDefault(_datNode);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _chalk = require('chalk');var _chalk2 = _interopRequireDefault(_chalk);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new _bluebird2.default(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return _bluebird2.default.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}


module.exports = DatWrapper;

/**
                              * Adds Library-ish functions to a Dat. Expects the Dat's directory structure to
                              * follow Calibre's (Author Name/ Publication Title/ Files)
                              */
function DatWrapper(opts, addEntryCallback) {
		this.directory = opts.directory;
		this.key = opts.key;
		this.name = opts.name;
		this.addEntryCallback = addEntryCallback;
		this.dat = this.initDat();
}

DatWrapper.prototype.initDat = function () {
		const opts = {
				key: this.key,
				sparse: true };

		return (0, _datNode2.default)(this.directory, opts, (err, dat) => {
				if (err) {
						console.error(err);
						return;
				}
				// setup error
				const exitHandler = options => error => {
						if (options.cleanup) {
								console.log('cleaning up!');
								dat.leave();
						}
						if (error) console.log(error.stack);
						if (options.exit) process.exit();
				};

				process.on('exit', exitHandler({ cleanup: true }));
				process.on('SIGINT', exitHandler({ exit: true }));
				process.on('uncaughtException', exitHandler({ exit: true }));

				this.start(dat).
				catch(error => {
						console.error(error);
						process.exit();
				});
		});
};

DatWrapper.prototype.start = (() => {var _ref = _asyncToGenerator(function* (dat) {var _this = this;
				const archive = dat.archive;
				const archiveList = _bluebird2.default.promisify(archive.list, { context: archive });

				const network = dat.joinNetwork();
				const stats = dat.trackStats();
				stats.once('update', function () {
						console.log('stats updated', stats.get());
				});

				network.once('connection', function () {
						console.log('connects via network');
						console.log(_chalk2.default.gray(_chalk2.default.bold('peers:'), network.connected));
				});

				archive.on('download', function (data) {
						//console.log(chalk.gray(chalk.bold('downloading:'), data));
				});

				let list = yield archiveList();
				list = list.map(function (entry) {return _lodash2.default.pick(entry, ['name', 'type']);});
				list.forEach(function ({ type, name }) {
						_this.addEntryCallback(_this, { type, name });
						//console.log((type === 'file') ? chalk.bold(name) : name);
				});
		});return function (_x) {return _ref.apply(this, arguments);};})();