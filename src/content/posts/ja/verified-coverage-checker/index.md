---
title: "検証付きカバレッジ検査器"
description: "パターンマッチのCoverage CheckingアルゴリズムをAgdaで形式化した"
date: "2025-12-18"
tags: ["agda", "agda2hs", "coverage-checking"]
---

この記事は[証明支援系 Advent Calendar 2025](https://adventar.org/calendars/11438)の18日目の記事です．

去年の春頃からパターンマッチのカバレッジ検査アルゴリズムの形式化を進めていました．それがある程度完成したので，今回紹介したいと思います[^1]．

## 目次

## 背景

パターンマッチのカバレッジ検査は，パターンが*網羅性*と*非冗長性*の二つの嬉しい性質を満たしているかを検査する静的解析です．

- 網羅性: どんな値に対しても何らかのパターンにマッチすること
- 非冗長性: 実行が辿り着かないパターンがないこと

以下の例を見てみましょう．このOCamlプログラムでは単純なアクセス制御のための関数`allowed`をパターンマッチを用いて実装しています．

```ocaml
type role = Staff | Manager | Admin
type action = View | Edit | Approve | Delete

let allowed role action =
  match role, action with
  | _,                 View    -> true
  | (Manager | Staff), Delete  -> false
  | manager,           Approve -> true
  | Staff,             Approve -> false
```

このパターンは網羅的でしょうか？ いいえ，例えば`Staff, Edit`のパターンを考慮し忘れています．
このままでは，`allowed Staff Edit`を評価した際に実行時例外が発生してしまいます．

では非冗長性はどうでしょうか？これも満たしません．三つ目のケースの一つ目のパターンが`Manager`ではなく`manager`という変数パターンになっています．したがって`Staff, Approve`の場合も三つ目のケースにマッチし，結果として四つ目のケースには辿り着きません．冗長なパターンがある時，それはプログラマが考えていたものとは異なる，予想外の場合分けとなっている可能性があります．

この例から分かるように，プログラムの安全性や予測可能性を高める上で，カバレッジ検査は重要な解析となっています．

カバレッジ検査のためのアルゴリズムは様々なものが考案されています．

- Luc Marangetによるアルゴリズム $\mathcal{U}_\mathrm{rec}$[^2]
  - Rustのカバレッジ検査アルゴリズムの基礎になっている
  - 昔はOCamlコンパイラにも実装されていた
  - 単純なパターンしか扱わないが十分実用的である（大体のプログラムは単純なパターンで書けるため）
- Lower your guards[^3]
  - Haskellのカバレッジ検査アルゴリズムの基礎になっている
  - 複雑なパターンも扱う（GADTs, View Patterns, Pattern Synonyms, Strictness, ...）
- ...

これらのアルゴリズムには紙とペンによる正当性の証明もついています．嬉しいですね．

しかし，アルゴリズムの**実装**はどうでしょうか？いくら紙とペンによる正当性の証明があったとしても，実装が間違っていては不適切なエラーを出したり，バグを見逃したりする可能性があります．
実際，例としてRustのGitHubリポジトリをのぞいてみると，カバレッジ検査に関するissueがいくつか見つかります．

<https://github.com/rust-lang/rust/issues?q=is%3Aissue%20label%3AA-exhaustiveness-checking%20label%3AC-bug>

カバレッジ検査は重要な検査ですから，**実装まで含めて正しいことが検証されたカバレッジ検査器**が欲しくなるわけです．
調査してみると，検証付きコンパイラを含めて探してみても，そのようなものはほとんど見つかりません[^4]．
そこで，自分がよく使っている証明支援系Agdaを用いて，カバレッジ検査アルゴリズムを形式化し検証付き実装を得ることにしました．

形式化するアルゴリズムとしてはMarangetの $\mathcal{U}_\mathrm{rec}$ を選びました． $\mathcal{U}_\mathrm{rec}$ は比較的単純なので，形式化も実現しやすいと考えました．今後，より複雑な，あるいは効率的なアルゴリズムを形式化する際の基盤にもなりそうです．

## $\mathcal{U}_\mathrm{rec}$ の概要

では，$\mathcal{U}_\mathrm{rec}$ がどのようなものか見ていきましょう．

### $\mathcal{U}_\mathrm{rec}$ の扱う体系

上述の通り，$\mathcal{U}_\mathrm{rec}$ は比較的単純な体系を扱います．
具体的には，値として代数的データ型の値のみを考え，パターンとしてはワイルドカードパターン，コンストラクタパターン，Orパターンの三種類だけを考えます．
カバレッジ検査の際は，変数パターンはワイルドカードパターンとして扱えばいいです．

```math
\begin{array}{rcl}
v & \coloneqq & c(v_1, \cdots, v_n) \\
p & \coloneqq & \_ \\
  & | & c(p_1, \cdots, p_n) \\
  & | & (p_1 \mid p_2) \\
\end{array}
```

値ベクタ $(v_1, \cdots, v_n)$ とパターンベクタ $(p_1, \cdots, p_n)$ をそれぞれ $\overrightarrow{v}$ と $\overrightarrow{p}$ と書き，パターン行列（パターンベクタが並んだもの）を $P$ と書くことにします．パターン行列の各行が`match`式の各ケースを表しています．

明示されていませんが，これらの値やパターンには型がついていて，パターンマッチも同じ型の値とパターンに対してのみ行われます．

### 有用性

実は $\mathcal{U}_\mathrm{rec}$ は*有用性*と呼ばれる性質を検査するアルゴリズムです．有用性の定義は以下です．

> 定義（有用性）：パターンベクタ $\overrightarrow{p}$ がパターン行列 $P$ に対して有用であるとは，以下の条件を満たすことである
>
> 1. ある値ベクタ $\overrightarrow{v}$ が存在して
> 2. $P$ のどの行にも $\overrightarrow{v}$ がマッチせず
> 3. $\overrightarrow{p}$ が $\overrightarrow{v}$ にマッチする

なぜ有用性を考えるのでしょうか？それは，網羅性と非冗長性のどちらもが有用性を使って言い換えられるからです．

> 命題
>
> 1. $P$ が網羅的 $\iff$ ワイルドカードパターンのベクタが $P$ に対して有用でない
> 2. $P$ の第$i$節が非冗長 $\iff$ 第$i$節がそれより前の節たち（小行列）に対して有用である

したがって，$\mathcal{U}_\mathrm{rec}$ をもとにして網羅性/非冗長性検査アルゴリズムを実装することができるのです．

### $\mathcal{U}_\mathrm{rec}$ の動作原理

TODO: 書く

## 形式化のハイライト

### 正当性証明

```agda
record Useful (P : PatternMatrix) (ps : PatternVector) : Type where
  field
    witness : PatternVector
    P-witness-disjoint : Pとwitnessのどちらにもマッチする値がない
    ps-subsumes-witness : psはwitnessを包含する
```

```agda
decideUseful : (P : PatternMatrix) (ps : Pattern)
  → Either (Not (Useful P ps)) (Useful P ps)
```

### 停止性証明

1. パターンの大きさはOrパターンを全部展開してから数える[^5]
2. ワイルドカードパターンの大きさを0とする（サイズに含めない）
3. 2の結果としてサイズが減らなくなるステップが出てくるので，そのステップで減る別のサイズを組み合わせた辞書式順序を考える

### agda2hsによるHaskellへの変換

今回のゴールは検証付きカバレッジ検査器を得ることなので，Agdaのコードを実行可能な形式に持っていけるようにしたいです．
その方法として，今回はagda2hsを使うことにしました．
agda2hsはAgda（のサブセット）をなるべく元のコードに近いHaskellコードに変換するツールです．Agdaに付属のHaskellへのコンパイラが出力するコードと比較して，圧倒的に読みやすいコードを生成してくれます．

agda2hsでは，Agdaのコードのどの部分をHaskellに変換するかを，Agdaのerasureという機能を使って指定します．Agdaコード中で`@0`で注釈をつけた部分はHaskell側では消えているという具合です．例えば，長さで添え字づけられたリストを表すAgdaのデータ型（よくVectorと呼ばれる型）を考えます．添え字部分を`@0`で注釈すると，コンパイル結果として得られるHaskellのデータ型はリストと全く同型なものになります．

```agda
data Vector (a : Type) : @0 Nat → Type where
  Nil  : Vector a 0
  Cons : ∀ {@0 n} → a → Vector a n → Vector a (suc n)
```

```haskell
data Vector a
  = Nil
  | Cons a (Vector a)
```

このような調子で，カバレッジ検査を形式化したAgdaコードにも，適切なところに`@0`をつけていきました．その結果，直接Haskellで実装した場合と大差ないであろうコードを得ることができました！

## おわりに

この記事では，Agdaを使って検証付きカバレッジ検査器を実装した話をしました．

今後は，今回の形式化をベースとして，より複雑/効率的なアルゴリズムを形式化していきたいと思います．
まずは，Rustで実装されている，全ての節の非冗長性と網羅性を一気に検査するように最適化されたバージョン[^6]の形式化に取り組みたいです．

形式化したコード全体を[GitHub](https://github.com/wasabi315/coverage-checking)で公開しています．HTMLに変換したコードもGitHub Pagesでホストしているので，興味があれば見てみてください．

<https://wasabi315.github.io/coverage-checking/>

みなさん，良い `(クリスマス | お年)` を！

[^1]: 去年のAdvent Calendarにこの記事を書くつもりだったのですが，完成しなかったため今年になってしまいました. 実はこの形式化について論文も書いていて，今後出版される予定です．Pre-printは[ここ](https://wasabi315.github.io/files/wctp2025a.pdf)で公開しています．
[^2]: [Luc Maranget, Warnings for Pattern Matching](https://doi.org/10.1017/S0956796807006223). この論文はアルゴリズムをいくつか提案しており，$\mathcal{U}_\mathrm{rec}$ はその中の一番基本的なものです．
[^3]: [Sebastian Graf, Simon Peyton Jones, and Ryan G. Scott, Lower your guards](https://doi.org/10.1145/3408989)
[^4]: 自分の調べた限り，concurrent workである[Joshua M. Cohen, A Mechanized First-Order Theory of Algebraic Data Types with Pattern Matching](https://doi.org/10.4230/LIPIcs.ITP.2025.5)以外には見つかりませんでした．そしてこの論文も同様に先行研究が見当たらないことを主張しています．
[^5]: 実際はOrパターンの数もサイズに含めます．展開して数えたサイズだけではOrパターンのステップでサイズが減らなくなるからです．
[^6]: 現状では，網羅性検査と各節に対しての非冗長性検査を別々に行うので，節の数に比例した回数だけ$\mathcal{U}_\mathrm{rec}$を呼び出すことになります．
