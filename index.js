var argv = require('yargs')
	.usage('Usage: $0 -registry-url [string]')
	.options('u', {
      alias: 'registry-url',
			default: 'https://registry.npmjs.org/'
    })
	.argv;

var Wiretree = require('wiretree');
var path = require('path');
var tree = new Wiretree( __dirname );

tree.add(argv.registryUrl, 'registryUrl');
tree.load(path.join('node_modules', 'promise'), 'Promise');
tree.load(path.join('node_modules', 'then-request'), 'thenRequest');
tree.load(path.join('node_modules', 'semver'), 'semver');
tree.load(path.join('node_modules', 'lodash'), '_');
tree.load(path.join(process.cwd(), 'package.json'), 'packageJson');
tree.load(path.join('lib', 'dependency-tree.js'), 'dependencyTree');
tree.load(path.join('lib', 'request.js'), 'request');
