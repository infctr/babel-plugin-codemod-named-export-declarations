export interface IFoo {
  a: string;
}
export interface IBar extends IFoo {
  d?: any;
}
export const foo: IFoo = {
  a: 'a'
};
export function func(arg: IFoo): IBar {
  return arg;
}
interface Baz extends Readonly<IFoo> {}
export { Baz as Bazz };