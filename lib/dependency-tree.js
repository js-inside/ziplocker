'use strict';

exports.wiretree = function getDependencyTree (packageJson, request, Promise, semver) {
  /**
   * The dependency types
   * @readonly
   * @name DEPENDENCY_TYPES
   * @enum {String}
   */
  var DEPENDENCY_TYPES = {
    DEPENDENCIES: 'dependencies',
    OPTIONAL_DEPENDENCIES: 'optionalDependencies'
  };

  return buildTree(packageJson, {});

  /**
   * Recursively builds a dependency tree
   * @param {Object} packageJson package.json type data describing the dependencies.
   * @param {Object} tree The tree or branch of the tree being built.
   * @returns {Promise}
   */
  function buildTree (packageJson, tree) {
    return Promise.all([
      buildDependencies(DEPENDENCY_TYPES.DEPENDENCIES, packageJson, tree),
      buildDependencies(DEPENDENCY_TYPES.OPTIONAL_DEPENDENCIES, packageJson, tree)
    ])
    .then(function returnTree () {
      return tree;
    });
  }

  /**
   * Fetches dependencies and writes info to the tree.
   * @param {DEPENDENCY_TYPES} type
   * @param {Object} packageJson package.json type data describing the dependencies.
   * @param {Object} tree The tree or branch of the tree being built.
   * @returns {Promise}
   */
  function buildDependencies (type, packageJson, tree) {
    if (!packageJson[type])
      return Promise.resolve();

    var dependencyPromises = Object.keys(packageJson[type])
      .map(function getDependencies (dependency) {
        return request(dependency)
          .then(function packageInfo (response) {
            var versions = Object.keys(response.body.versions);
            var dependencyVersion = packageJson[type][dependency];
            var version = semver.maxSatisfying(versions, dependencyVersion);

            if (!tree[type])
              tree[type] = {};

            tree[type][dependency] = {
              version: version
            };

            return [response.body, tree[type][dependency]];
          })
          .then(function (args) {
            return buildTree(args[0], args[1]);
          });
      });

    return Promise.all(dependencyPromises);
  }
};
