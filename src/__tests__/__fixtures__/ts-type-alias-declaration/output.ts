export interface IFoo {
  a: string;
}
export interface IBar {
  d?: any;
}
type TFoo = IFoo & IBar;
export const FOO = 'FOO';
export const BAR = 'BAR';
export type TBar = typeof FOO | typeof BAR;
export const foo: IFoo = {
  a: 'a'
};
export { TFoo as TQax };