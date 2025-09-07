---
order: 2
title: "lazy.js"
featuredImage: "./featured-image.png"
thumbnail: "./thumbnail.png"
description: "JavaScriptで実装された遅延評価機構"
githubRepository: "wasabi315/lazy"
---

lazy.jsはJavaScriptで実装された遅延評価機構です．昔Haskellに使われていたeval/apply形式のSTGをもとにしています．

<https://github.com/wasabi315/lazy>

## 目次

## 例

lazy.jsで何ができるか見てみましょう．

### 不動点演算子

Haskellの不動点演算子`fix`の定義ってかっこいいですよね．

```haskell
fix :: (a -> a) -> a
fix f = let x = f x in x
```

これ，lazy.jsでもできるんです！嬉しい！

```javascript
const fix = Fun((f) => {
  const x = Thunk(() => f(x));
  return x;
});
```

この`fix`を使うと，例えば階乗関数を次のように定義できます．

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

// 3628800が表示される
Evaluate(main);
```

### フィボナッチ数列の無限リスト

```haskell
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)
```

この有名なフィボナッ数列のリストの定義もlazy.jsでできます．やった〜！

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

// フィボナッチ数が延々と表示される
Evaluate(main);
```

たらいまわし関数やTardisモナドなど，他の例は[リポジトリ](https://github.com/wasabi315/lazy/tree/main/examples)を見てみてください．

## API

lazy.jsでは，`Fun`，`Con`，`Case`，`Thunk`の各コンストラクタを使って遅延計算を組み立てるように設計しています．その組み立てられた計算は`Evaluate`関数で評価できます．

### `Fun`

`Fun`は関数を定義するためのコンストラクタです．生成される関数はカリー化されており，部分適用も自動的に処理されます．

```javascript
const flip = Fun((f, x, y) => f(y, x));
// can be used like
... flip(sub, 1) ...
```

### `Con`

`Con`はデータコンストラクタを定義するためのものです．
`Fun`とは違って，`Con`は全部の引数を一度にまとめて適用しないといけません．

```javascript
const Nil = Con("Nil");
const Cons = (x, xs) => Con("Cons", x, xs);
```

### `Thunk`

`Thunk`は遅延された計算(サンク)を定義するためのものです．計算の結果は最初の評価された後にメモ化されます．
参考にした論文と同様に，lazy.jsでは値(関数やサンク，数値)に対してしか関数やコンストラクタを適用できません．
そのため，式をラップするのに`Thunk`をよく使うことになります．

```javascript
const pred = Thunk(() => flip(sub, 1));
const num = Thunk(() => pred(43));
Evaluate(traceInt(num)); // 42が表示される
```

### `Case`

`Case`は評価したい計算と，各ケースの計算を持ったレコードを受け取ります．
評価される計算は値でなくてもいいです．
`default`はデフォルトのケースを表す特別なケースです．

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

## 実装の参考文献

- **Making a fast curry: push/enter vs. eval/apply for higher-order languages** <br>
  2004, Simon Marlow, Simon Peyton Jones, <https://doi.org/10.1145/1016848.1016856>
- **Implementing lazy functional languages on stock hardware: the Spineless Tagless G-machine** <br>
  1992, Simon Peyton Jones, <https://doi.org/10.1017/S0956796800000319>
- **STG Version 2.5 の動作** <https://mizunashi-mana.github.io/blog/posts/2019/04/haskell-old-stg-syntax>
- **Blackhole : 無限再帰停止機構** <https://qiita.com/phi16/items/ef83e610585ac8526d31>
