'use strict';

var miniJasmineLib = require('minijasminenode');

miniJasmineLib.addSpecs('test/global.js');
miniJasmineLib.addSpecs('test/lib/dependency-tree.js');
miniJasmineLib.addSpecs('test/lib/request.js');
miniJasmineLib.executeSpecs();
