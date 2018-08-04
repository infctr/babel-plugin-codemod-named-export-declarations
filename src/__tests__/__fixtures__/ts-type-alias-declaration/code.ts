interface IFoo {
  a: string;
}

interface IBar {
  d?: any;
}

type TFoo = IFoo & IBar;

const FOO = 'FOO';
export const BAR = 'BAR';

type TBar = typeof FOO | typeof BAR;

const foo: IFoo = {
  a: 'a'
};

export { FOO, IBar, foo, IFoo, TBar, TFoo as TQax };
