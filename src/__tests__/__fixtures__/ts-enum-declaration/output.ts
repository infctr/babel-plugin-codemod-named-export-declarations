export enum Foo {
  A,
  B,
  C,
}
enum Bar {
  A = 'A',
  B = 'B',
  C = 'C',
}
export const foo: Bar = Bar.A;
export { Bar as Baz };