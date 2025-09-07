---
order: 2
title: "lazy.js"
featuredImage: "./featured-image.png"
thumbnail: "./thumbnail.png"
description: "A STG-like lazy evaluation mechanism in JavaScript"
githubRepository: "wasabi315/lazy"
---

lazy.js provides a lazy evaluation mechanism inspired by the eval/apply version of STG used in Haskell before. You can define and evaluate lazy computations in JavaScript using this library.

<https://github.com/wasabi315/lazy>

## Contents

## Examples

Let's see what you can do with lazy.js.

### Fixed-point combinator

The definition of the `fix` function in Haskell is one of the most beautiful things in the world.

```haskell
fix :: (a -> a) -> a
fix f = let x = f x in x
```

This mind-blowing definition of the `fix` function is possible in lazy.js!!

```javascript
const fix = Fun((f) => {
  const x = Thunk(() => f(x));
  return x;
});
```

With this `fix` function you can define the factorial function for example:

```javascript
const factBody = Fun((f, n) =>
  Case(n, {
    [0]: () => 1,
    default: (n) => {
      const fm = Thunk(() => f(n - 1));
      return mul(n, fm);
    },
  })
);
const fact = Thunk(() => fix(factBody));

const main = Thunk(() => {
  const factN = Thunk(() => fact(10));
  return traceInt(factN);
});

// Prints 3628800
Evaluate(main);
```

### Infinite list of Fibonacci numbers

```haskell
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)
```

This well-known definition of the Fibonacci sequence is also possible.

```javascript
const fibs = Thunk(() => {
  const xs = Thunk(() => tail(fibs));
  const ys = Thunk(() => zipWith(add, fibs, xs));
  const zs = Thunk(() => Cons(1n, ys));
  return Cons(0n, zs);
});

const main = Thunk(() => {
  const ns = Thunk(() => map(traceInt, fibs));
  return rnfList(ns);
});

// Prints Fibonacci numbers
Evaluate(main);
```

For more examples including the tarai function and Tardis monad, check out the [repository](https://github.com/wasabi315/lazy/tree/main/examples).

## API

In lazy.js, lazy computations can be built using the `Fun`, `Con`, `Case`, and `Thunk` constructors. The resulting computation can then be evaluated using the `Evaluate` function.
A set of functions is provided in `prelude.js` for convenience, including list operations and arithmetic operations.

### `Fun`

`Fun` is a constructor for a function. The resulting function is curried, and partial application is handled automatically.

```javascript
const flip = Fun((f, x, y) => f(y, x));
// can be used like
... flip(sub, 1) ...
```

### `Con`

`Con` is for defining a data constructor.
Unlike `Fun`, `Con` must be applied with all the arguments at once.

```javascript
const Nil = Con("Nil");
const Cons = (x, xs) => Con("Cons", x, xs);
```

### `Thunk`

`Thunk` is for defining a lazy computation.
The result of the computation is memoized after the first evaluation.
This is the most frequently used constructor in lazy.js.
The reason is that you can only apply functions and constructors to values (functions, thunks, and numbers) so you have to manually wrap every sub-expression with `Thunk`.

```javascript
const pred = Thunk(() => flip(sub, 1));
const num = Thunk(() => pred(43));
Evaluate(traceInt(num)); // Prints 42
```

### `Case`

A `Case` expression takes a computation to be analyzed (a scrutinee) and a dictionary of alternatives as functions.
The scrutinee need not be a value.
`default` is a special key for the default alternative.

```javascript
const filter = Fun((p, xs) =>
  Case(xs, {
    Nil: () => Nil,
    Cons: (x, xs) =>
      Case(p(x), {
        True: () => {
          const ys = Thunk(() => filter(p, xs));
          return Cons(x, ys);
        },
        False: () => filter(p, xs),
      }),
  })
);

const seq = Fun((x, y) => Case(x, { default: (_) => y }));
```

## References

- **Making a fast curry: push/enter vs. eval/apply for higher-order languages** <br>
  2004, Simon Marlow, Simon Peyton Jones, <https://doi.org/10.1145/1016848.1016856>
- **Implementing lazy functional languages on stock hardware: the Spineless Tagless G-machine** <br>
  1992, Simon Peyton Jones, <https://doi.org/10.1017/S0956796800000319>
- **STG Version 2.5 の動作** <https://mizunashi-mana.github.io/blog/posts/2019/04/haskell-old-stg-syntax>
- **Blackhole : 無限再帰停止機構** <https://qiita.com/phi16/items/ef83e610585ac8526d31>
