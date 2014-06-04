#Introduction

Ziplocker is a simple replacement for `npm shrinkwrap` that takes optional dependencies into account.
It also will fetch your dependencies for the first time via `package.json` avoiding cases where optional
dependencies are added by `postinstall`.

#Overview

If `ziplocker` is run while there isn't a `ziplock.json` in the current directory,
it will recursively determine dependencies and use them to build out the `ziplock.json` file. It will then
install the dependencies found in `ziplock.json`; if it encounters an optional dependency in `ziplock.json` that
is not installable it will continue on.

If `ziplocker` is run while there is a `ziplock.json` in the current directory,
it will use the `ziplock.json` file to install dependencies. If you wish to install `devDependencies`
afterwards, just run `npm install` after running `ziplocker`.

#Options

`ziplocker` supports the following command line options:

`--registry-url` (default: https://registry.npmjs.org/): The registry to fetch dependencies from.
