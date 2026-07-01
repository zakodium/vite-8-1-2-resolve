Created from `npm create vite@latest` with react, typescript and eslint.

I added blueprintjs dependencies, remove all code from template to keep it simple.

`vite dev` works fine.

# Repro step

```
npm install
npm run build
```

Give this error

```
> vite-8-1-2-resolve@0.0.0 build
> tsc -b && vite build

vite v8.1.2 building client environment for production...
transforming...✓ 1587 modules transformed.
rendering chunks...
✗ Build failed in 142ms
error during build:
Build failed with 1 error:

[MISSING_EXPORT] "placements" is not exported by "node_modules/@popperjs/core/lib/index.js".
    ╭─[ node_modules/@blueprintjs/core/lib/esm/components/popover/popperUtils.js:16:10 ]
    │
 16 │ export { placements as PopperPlacements } from "@popperjs/core";
    │          ─────┬────  
    │               ╰────── Missing export
────╯

    at aggregateBindingErrorsIntoJsError (file:///Users/tpoisseau/Projects/repro/vite-8-1-2-resolve/node_modules/rolldown/dist/shared/error-B68YLzl3.mjs:48:18)
    at unwrapBindingResult (file:///Users/tpoisseau/Projects/repro/vite-8-1-2-resolve/node_modules/rolldown/dist/shared/error-B68YLzl3.mjs:18:128)
    at #build (file:///Users/tpoisseau/Projects/repro/vite-8-1-2-resolve/node_modules/rolldown/dist/shared/rolldown-build-DR0wzp0V.mjs:3256:34)
    at async buildEnvironment (file:///Users/tpoisseau/Projects/repro/vite-8-1-2-resolve/node_modules/vite/dist/node/chunks/node.js:32593:66)
    at async Object.build (file:///Users/tpoisseau/Projects/repro/vite-8-1-2-resolve/node_modules/vite/dist/node/chunks/node.js:33015:19)
    at async Object.buildApp (file:///Users/tpoisseau/Projects/repro/vite-8-1-2-resolve/node_modules/vite/dist/node/chunks/node.js:33012:153)
    at async CAC.<anonymous> (file:///Users/tpoisseau/Projects/repro/vite-8-1-2-resolve/node_modules/vite/dist/node/cli.js:777:3) {
  errors: [Getter/Setter]
}

Process finished with exit code 1
```

# Workaround

Replace vite version to `=8.0.16` in the `package.json`

```
    "vite": "=8.0.16"
```

then

```
npm install
npm run build
```

It gives:

```
> vite-8-1-2-resolve@0.0.0 build
> tsc -b && vite build

vite v8.0.16 building client environment for production...
transforming...✓ 2415 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                   0.39 kB │ gzip:   0.27 kB
dist/assets/allPaths-D7hON7HF.js                  0.19 kB │ gzip:   0.17 kB
dist/assets/allPathsLoader-BesjNEtP.js            0.44 kB │ gzip:   0.26 kB
dist/assets/splitPathsBySizeLoader-DZ86SutO.js    0.44 kB │ gzip:   0.28 kB
dist/assets/index-D9D7YXcB.js                   244.87 kB │ gzip:  80.58 kB
dist/assets/paths-BpNTeNH7.js                   305.15 kB │ gzip: 103.20 kB
dist/assets/paths-D75bGUmj.js                   314.05 kB │ gzip: 105.78 kB

✓ built in 271ms

Process finished with exit code 0
```

<details>
<summary>More details</summary>

`node_modules/@popperjs/core/lib/index.js` exports `placements` from `node_modules/@popperjs/core/lib/enums.js`.
But the cjs version of `@popperjs/core` does not export `placements` from `node_modules/@popperjs/core/dist/cjs/popper.js`.

It seems the resolver had changes and breaks previous cases.

Here is the package.json of `@popperjs/core`

`node_modules/@popperjs/core/package.json`

```json
{
  "name": "@popperjs/core",
  "version": "2.11.8",
  "description": "Tooltip and Popover Positioning Engine",
  "main": "dist/cjs/popper.js",
  "main:umd": "dist/umd/popper.js",
  "module": "lib/index.js",
  "unpkg": "dist/umd/popper.min.js",
  "author": "Federico Zivolo <federico.zivolo@gmail.com>",
  "license": "MIT",
  "repository": "github:popperjs/popper-core",
  "keywords": [
    "tooltip",
    "popover",
    "dropdown",
    "popup",
    "popper",
    "positioning engine"
  ],
  "funding": {
    "type": "opencollective",
    "url": "https://opencollective.com/popperjs"
  },
  "files": [
    "index.d.ts",
    "/dist",
    "/lib"
  ],
  "sideEffects": false,
  "scripts": {
    "clean": "rimraf lib && rimraf dist && rimraf test/visual/dist",
    "test": "yarn test:unit && yarn test:functional",
    "test:unit": "jest --coverage src",
    "test:functional": "DEV_PORT=`get-port` jest tests/functional",
    "test:flow": "flow",
    "test:typescript": "tsc --project tests/typescript/tsconfig.json",
    "test:eslint": "eslint .",
    "dev": "NODE_ENV=dev concurrently 'yarn serve' 'yarn build:dev --watch'",
    "serve": "serve -l ${DEV_PORT:-5000} tests/visual",
    "build": "yarn clean && yarn build:es && yarn build:esbrowser && yarn build:bundles && yarn build:flow && yarn build:typescript",
    "build:es": "babel src -d lib --ignore '**/*.test.js','**/__mocks__'",
    "build:esbrowser": "BROWSER_COMPAT=true yarn build:es -d dist/esm",
    "build:bundles": "rollup -c .config/rollup.config.js",
    "build:dev": "NODE_ENV=dev babel src -d tests/visual/dist",
    "build:flow": "flow-copy-source --ignore \"**/*.test.js\" src lib && replace-in-files --string=__DEV__ --replacement=false 'lib/**/*.flow'",
    "build:typescript": "rimraf dist/typescript; flow-to-ts \"src/**/*.js\" --write --inline-utility-types; tsc-silent --project .config/tsconfig.json --createSourceFile .config/createSourceFile.js --suppress @; rimraf \"src/**/*.ts\"",
    "prepublishOnly": "yarn build && pinst --disable",
    "prepare": "husky install .config/husky",
    "postpublish": "pinst --enable"
  },
  "prettier": {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "proseWrap": "always"
  },
  "babel": {
    "extends": "./.config/babel.config"
  },
  "jest": {
    "preset": "./.config/jest.config"
  },
  "eslintConfig": {
    "extends": "./.config/eslint.config"
  },
  "husky": {
    "hooks": {
      "pre-commit": "pretty-quick --staged"
    }
  },
  "devDependencies": {
    "@ampproject/rollup-plugin-closure-compiler": "^0.26.0",
    "@atomico/rollup-plugin-sizes": "^1.1.4",
    "@babel/cli": "^7.12.17",
    "@babel/core": "^7.12.17",
    "@babel/plugin-transform-flow-strip-types": "^7.12.13",
    "@babel/plugin-transform-runtime": "^7.12.17",
    "@babel/preset-env": "^7.12.17",
    "@fezvrasta/tsc-silent": "^1.3.0",
    "@khanacademy/flow-to-ts": "^0.3.0",
    "@rollup/plugin-babel": "^5.3.0",
    "@rollup/plugin-replace": "^2.3.4",
    "babel-eslint": "^10.0.3",
    "babel-jest": "^26.6.3",
    "babel-plugin-add-import-extension": "^1.4.4",
    "babel-plugin-annotate-pure-calls": "^0.4.0",
    "babel-plugin-dev-expression": "^0.2.2",
    "babel-plugin-inline-replace-variables": "^1.3.1",
    "babel-plugin-transform-inline-environment-variables": "^0.4.3",
    "concurrently": "^5.3.0",
    "dotenv": "^8.2.0",
    "eslint": "^7.20.0",
    "eslint-plugin-flowtype": "^5.2.2",
    "eslint-plugin-import": "^2.22.1",
    "eslint-plugin-unused-imports": "^1.1.0",
    "flow-bin": "^0.139.0",
    "flow-copy-source": "^2.0.9",
    "get-port-cli": "^2.0.0",
    "husky": "^5.0.9",
    "jest": "^26.6.3",
    "jest-environment-jsdom-sixteen": "^1.0.3",
    "jest-environment-puppeteer": "^4.4.0",
    "jest-image-snapshot": "^4.3.0",
    "jest-puppeteer": "^4.4.0",
    "pinst": "^2.1.4",
    "poster": "^0.0.9",
    "prettier": "^2.2.1",
    "pretty-quick": "^3.1.0",
    "puppeteer": "^10.4.0",
    "replace-in-files-cli": "^1.0.0",
    "rollup": "^2.39.0",
    "rollup-plugin-flow-entry": "^0.3.3",
    "rollup-plugin-license": "^2.2.0",
    "rollup-plugin-terser": "^7.0.2",
    "rollup-plugin-visualizer": "^4.2.0",
    "serve": "^11.3.2",
    "typescript": "^4.1.5"
  }
}
```

</details>

NB: Same issue with `=8.1.0` and `=8.1.1`.