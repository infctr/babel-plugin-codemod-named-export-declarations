enum Foo {
  A,
  B,
  C
}

enum Bar {
  A = 'A',
  B = 'B',
  C = 'C'
}

const foo: Bar = Bar.A;

export { Foo, Bar as Baz, foo };
