var argv = require('yargs')
	.usage('Usage: $0 -registry-url [string] -proxy-url [string]')
	.options('r', {
      alias: 'registry-url',
			default: 'https://registry.npmjs.org/'
    })
  .options('p', {
    alias: 'proxy-url',
    default: null
  })
	.argv;

var Wiretree = require('wiretree');
var path = require('path');
var fs = require('fs');
var spinner = require('char-spinner');
var tree = new Wiretree(__dirname);

tree.add(argv.registryUrl, 'registryUrl');
tree.add(argv.proxyUrl, 'proxyUri');
tree.add(process.cwd(), 'cwd');
tree.add(fs, 'fs');
tree.add(path, 'path');
tree.load(path.join('node_modules', 'promise'), 'Promise');
tree.load(path.join('node_modules', 'request-then'), 'requestThen');
tree.load(path.join('node_modules', 'semver'), 'semver');
tree.load(path.join(process.cwd(), 'package.json'), 'packageJson');
tree.load(path.join('lib', 'ziplock-json.js'), 'ziplockJson');
tree.load(path.join('lib', 'get-dependency-tree.js'), 'getDependencyTree');
tree.load(path.join('lib', 'request.js'), 'request');

tree.get('ziplockJson');

spinner();
