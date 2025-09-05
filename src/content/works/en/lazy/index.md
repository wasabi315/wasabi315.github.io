---
order: 2
title: "lazy.js"
featuredImage: "./featured-image.png"
thumbnail: "./thumbnail.png"
description: "A STG-like lazy evaluation mechanism in JavaScript"
githubRepository: "wasabi315/lazy"
---

lazy.js provides a lazy evaluation mechanism inspired by the eval/apply version of STG used in Haskell before (I believe). You can define and evaluate lazy computations in JavaScript using this library.

<https://github.com/wasabi315/lazy>

## Contents

## Examples

Let's see what you can do with lazy.js first.

### Fixed-point combinator

 The definition of the `fix` function in Haskell is one of the most beautiful things in the world. (Don't you think so?)

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

// Infinitely prints Fibonacci numbers
Evaluate(main);
```

For more examples, check out the [repository](https://github.com/wasabi315/lazy/tree/main/examples).

## API

To define a lazy computation, use the `Fun`, `Con`, `Case`, and `Thunk` constructors. Then, evaluate the computation using the `Evaluate` function.
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
As in the papers, you can only apply functions and constructors to *variables* (`Fun`ctions, `Thunk`s, or function arguments) and numbers in lazy.js.
So you will have to wrap most expressions with `Thunk`.

```javascript
const pred = Thunk(() => flip(sub, 1));
const num = Thunk(() => pred(43));
Evaluate(traceInt(num)); // Prints 42
```

### `Case`

A `Case` expression takes a computation to be analyzed (a scrutinee) and a dictionary of alternatives as functions.
The scrutinee need not be a variable or a number.
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

### Numbers

As in the examples above, numbers and bigints can be used directly in the code.
lazy.js extends the `Number` and `BigInt` prototypes internally to enable this.

## Implementation

lazy.js does not depend on any external libraries, so it works in any JavaScript environment. I tested only in Deno, though.

## References

- **Making a fast curry: push/enter vs. eval/apply for higher-order languages** <br>
  2004, Simon Marlow, Simon Peyton Jones, <https://doi.org/10.1145/1016848.1016856>
- **Implementing lazy functional languages on stock hardware: the Spineless Tagless G-machine** <br>
  1992, Simon Peyton Jones, <https://doi.org/10.1017/S0956796800000319>
- **STG Version 2.5 の動作** <https://mizunashi-mana.github.io/blog/posts/2019/04/haskell-old-stg-syntax>
