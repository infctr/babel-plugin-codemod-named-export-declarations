# babel-plugin-codemod-named-export-declarations

This plugin replaces `export` object literal declaration with corresponding named export declarations with Typescript support.

## Example

**In**

```javascript
type IFoo = string;

const foo: IFoo = 'foo';

export { foo, IFoo };
```

**Out**

```javascript
export type IFoo = string;

export const foo: IFoo = 'foo';
```

## Installation

```sh
yarn add -D babel-plugin-codemod-named-export-declarations
```

## Usage

### Via CLI (recommended)

Run transforms on your files with excellent [babel-codemod](https://github.com/square/babel-codemod)! Considered it's installed locally:

```sh
./node_modules/.bin/codemod -p babel-plugin-codemod-named-export-declarations script.js
```

The plugin inherits `@babel/plugin-syntax-typescript` for Typescript support. Add syntax plugins to parse JSX:

```sh
./node_modules/.bin/codemod \
  -p babel-plugin-codemod-named-export-declarations \
  -p babel-plugin-syntax-jsx \
  component.tsx
```

### Via Node API

```javascript
require('babel-core').transform('code', {
  plugins: ['codemod-named-export-declarations']
});
```
