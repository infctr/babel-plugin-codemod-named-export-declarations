interface IFoo {
  a: string;
}

interface IBar extends IFoo {
  d?: any;
}

const foo: IFoo = {
  a: 'a',
};

function func(arg: IFoo): IBar {
  return arg;
}

interface Baz extends Readonly<IFoo> {}

export { IBar, foo, IFoo, func, Baz as Buzz };
