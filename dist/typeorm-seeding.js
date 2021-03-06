'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var chalk = _interopDefault(require('chalk'));
var Faker = require('faker');
var typeorm = require('typeorm');
require('reflect-metadata');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const getNameOfEntity = (entity) => {
    if (entity instanceof Function) {
        return entity.name;
    }
    else if (entity) {
        return new entity().constructor.name;
    }
    throw new Error('Enity is not defined');
};
const isPromiseLike = (o) => !!o && (typeof o === 'object' || typeof o === 'function') && typeof o.then === 'function' && !(o instanceof Date);

const printError = (message, error) => {
    console.log('\n❌ ', chalk.red(message));
    if (error) {
        console.error(error);
    }
};

class EntityFactory {
    constructor(name, entity, factory, settings) {
        this.name = name;
        this.entity = entity;
        this.factory = factory;
        this.settings = settings;
    }
    map(mapFunction) {
        this.mapFunction = mapFunction;
        return this;
    }
    make(overrideParams = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.factory) {
                let entity = yield this.resolveEntity(this.factory(Faker, this.settings));
                if (this.mapFunction) {
                    entity = yield this.mapFunction(entity);
                }
                for (const key in overrideParams) {
                    if (overrideParams.hasOwnProperty(key)) {
                        entity[key] = overrideParams[key];
                    }
                }
                return entity;
            }
            throw new Error('Could not found entity');
        });
    }
    seed(overrideParams = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = global.seeder.connection;
            if (connection) {
                const em = connection.createEntityManager();
                try {
                    const entity = yield this.make(overrideParams);
                    return yield em.save(entity);
                }
                catch (error) {
                    const message = 'Could not save entity';
                    printError(message, error);
                    throw new Error(message);
                }
            }
            else {
                const message = 'No db connection is given';
                printError(message);
                throw new Error(message);
            }
        });
    }
    makeMany(amount, overrideParams = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = [];
            for (let index = 0; index < amount; index++) {
                list[index] = yield this.make(overrideParams);
            }
            return list;
        });
    }
    seedMany(amount, overrideParams = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = [];
            for (let index = 0; index < amount; index++) {
                list[index] = yield this.seed(overrideParams);
            }
            return list;
        });
    }
    resolveEntity(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const attribute in entity) {
                if (entity.hasOwnProperty(attribute)) {
                    if (isPromiseLike(entity[attribute])) {
                        entity[attribute] = yield entity[attribute];
                    }
                    if (typeof entity[attribute] === 'object' && !(entity[attribute] instanceof Date)) {
                        const subEntityFactory = entity[attribute];
                        try {
                            if (typeof subEntityFactory.make === 'function') {
                                entity[attribute] = yield subEntityFactory.make();
                            }
                        }
                        catch (error) {
                            const message = `Could not make ${subEntityFactory.name}`;
                            printError(message, error);
                            throw new Error(message);
                        }
                    }
                }
            }
            return entity;
        });
    }
}

const importSeed = (filePath) => {
    const seedFileObject = require(filePath);
    const keys = Object.keys(seedFileObject);
    return seedFileObject[keys[0]];
};

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.normalize(path)
// posix version
function normalize(path) {
  var isPathAbsolute = isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isPathAbsolute).join('/');

  if (!path && !isPathAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isPathAbsolute ? '/' : '') + path;
}
// posix version
function isAbsolute(path) {
  return path.charAt(0) === '/';
}

// posix version
function join() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
}
function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ?
    function (str, start, len) { return str.substr(start, len) } :
    function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

const getConnectionOptions = (configPath = 'ormconfig.js') => __awaiter(void 0, void 0, void 0, function* () {
    return require(join(process.cwd(), configPath));
});
const createConnection = (configPath) => __awaiter(void 0, void 0, void 0, function* () {
    let options = yield getConnectionOptions(configPath);
    if (Array.isArray(options)) {
        options.forEach((item) => {
            if (item.name === 'default') {
                options = item;
            }
        });
    }
    return typeorm.createConnection(options);
});

const times = (n, iteratee) => __awaiter(void 0, void 0, void 0, function* () {
    const rs = [];
    for (let i = 0; i < n; i++) {
        const r = yield iteratee(i);
        rs.push(r);
    }
    return rs;
});

global.seeder = {
    connection: undefined,
    entityFactories: new Map(),
};
const setConnection = (connection) => (global.seeder.connection = connection);
const getConnection = () => global.seeder.connection;
const define = (entity, factoryFn) => {
    global.seeder.entityFactories.set(getNameOfEntity(entity), {
        entity,
        factory: factoryFn,
    });
};
const factory = (entity) => (settings) => {
    const name = getNameOfEntity(entity);
    const entityFactoryObject = global.seeder.entityFactories.get(name);
    return new EntityFactory(name, entity, entityFactoryObject.factory, settings);
};
const runSeeder = (clazz) => __awaiter(void 0, void 0, void 0, function* () {
    const seeder = new clazz();
    return seeder.run(factory, getConnection());
});

exports.setConnection = setConnection;
exports.getConnection = getConnection;
exports.define = define;
exports.factory = factory;
exports.runSeeder = runSeeder;
exports.times = times;
exports.importSeed = importSeed;
exports.getConnectionOptions = getConnectionOptions;
exports.createConnection = createConnection;
