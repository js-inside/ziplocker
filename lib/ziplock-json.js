'use strict';

exports.wiretree = function getZiplockJson (Promise, fs, path, cwd, getDependencyTree) {
  var readZiplockFile = Promise.denodeify(fs.readFile);
  var writeZiplockFile = Promise.denodeify(fs.writeFile);
  var PATH_TO_ZIPLOCK_FILE = path.join(cwd, 'ziplock.json');

  return readZiplockFile(PATH_TO_ZIPLOCK_FILE)
    .catch(function getDependencies(error) {
      if (error.code === 'ENOENT')
        return getDependencyTree()
          .then(function (dependencyTree) {
            return writeZiplockFile(PATH_TO_ZIPLOCK_FILE, JSON.stringify(dependencyTree, null, 2));
          });
      else
        throw error;
    });
};
