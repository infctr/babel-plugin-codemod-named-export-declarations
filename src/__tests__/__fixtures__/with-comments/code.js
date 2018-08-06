// NOTE: codemod should ignore comments
const foo = 'foo';

/**
* Codemod should work with
* multiline jsdoc
*/
function bar(x) {
  return x;
}

export { foo, bar };
