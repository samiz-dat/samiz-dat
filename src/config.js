/* configger.js
 * Reads configuration using nconf.
 * Returns a JavaScript object representing the effective configuration.
 */
import nconf from 'nconf';

module.exports = nconf
                .overrides({})
                .argv()
                .env({ separator: '__' })
                .file('config.json')
                .defaults({
                  dataDir: '_data',
                });
