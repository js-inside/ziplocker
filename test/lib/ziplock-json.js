'use strict';

describe('ziplock JSON', function () {
  var ziplockJson = require('../../lib/ziplock-json').wiretree;
  var Promise = require('promise');
  var path = require('path');

  var getDependencyTree, fs, cwd, ziplockJsonData, promise;

  beforeEach(function () {
    getDependencyTree = jasmine.createSpy('getDependencyTree');

    fs = {
      readFile: jasmine.createSpy('readFile'),
      writeFile: jasmine.createSpy('writeFile')
    };

    cwd = '/foo';

    ziplockJsonData = {
      dependencies: {
        foo: '1.2.3'
      }
    };

    promise = ziplockJson(Promise, fs, path, cwd, getDependencyTree);
  });

  it('should read the ziplock file', function () {
    expect(fs.readFile).toHaveBeenCalledWith(path.join(cwd, 'ziplock.json'), jasmine.any(Function));
  });

  it('should resolve file data if file exists', function (done) {
    promise.then(function (response) {
      expect(response).toEqual(ziplockJson);
      done();
    });

    var callback = fs.readFile.mostRecentCall.args[1];

    callback(null, ziplockJson);
  });

  it('should resolve with the dependency tree if the file does not exist', function (done) {
    promise.then(function (response) {
      expect(response).toEqual(ziplockJsonData);
      done();
    });

    var error = new Error('ENOENT, open \'/foo/bar.txt\'');
    error.code = 'ENOENT';
    fs.readFile.mostRecentCall.args[1](error);

    getDependencyTree.andReturn(Promise.resolve(ziplockJsonData));

    fs.writeFile.andCallFake(function (filePath, data, cb) {
      cb(null, data);
    });
  });

  it('should re-throw the error if not ENOENT', function (done) {
    promise.catch(function (reason) {
      expect(reason).toBe(error);
      done();
    });

    var error = new Error('Generic Error');
    error.code = 'EDUNNO';
    fs.readFile.mostRecentCall.args[1](error);
  });
});
