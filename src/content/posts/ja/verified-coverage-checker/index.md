---
title: "Verified Coverage Checker"
description: "パターンマッチのCoverage CheckingアルゴリズムをAgdaで形式化した"
date: "2025-12-18"
tags: ["agda", "agda2hs", "coverage-checking"]
---

この記事は[証明支援系 Advent Calendar 2025](https://adventar.org/calendars/11438)の18日目の記事です．

去年の春頃からパターンマッチのカバレッジ検査アルゴリズムの形式化を進めていました．それがある程度完成したので，今回紹介したいと思います[^1]．

## 目次

## 背景

パターンマッチのカバレッジ検査は，パターンが*網羅性*と*非冗長性*の二つの嬉しい性質を満たしているかを検査する静的解析です．

- 網羅性: 場合分けを漏らしているパターンがないこと
- 非冗長性: 実行が辿りつかないパターンがないこと

以下の例を見てみましょう．このOCamlコードでは単純なアクセス制御のための関数`allowed`をパターンマッチで実装しています．

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

このパターンは網羅的でしょうか？ いいえ，例えば`Staff, Edit`のパターンが漏れています．
このような漏れがあるままプログラムを実行してしまうと，実行時例外が発生してしまう可能性があります．
では，このパターンは非冗長性を満たすでしょうか？これもいいえです．三つ目のケースの一つ目のパターンが`Manager`ではなく`manager`という変数パターンになっています．`Staff, Approve`のパターンも三つ目のケースにマッチしてしまい，結果として四つ目のケースが実行されないことになってしまいます．冗長なパターンがある時は，プログラマが意図したものと異なる場合分けとなっている可能性があり，プログラマからすると予測不能な挙動となってしまいます．
この例から分かるように，プログラムの安全性や予測可能性を高める上で，カバレッジ検査は重要な解析となっています．

カバレッジ検査のためのアルゴリズムは様々なものが提案されています．

- Luc Marangetによるアルゴリズム[^2]
  - Rustのカバレッジ検査アルゴリズムの基礎になっている
  - 昔はOCamlコンパイラにも実装されていた
  - 単純なパターンしか扱わないが十分実用的である (大体のプログラムは単純なパターンで書けるため)
- Lower your guards[^3]
  - Haskellのカバレッジ検査アルゴリズムの基礎になっている
  - 複雑なパターンも扱う(GADTs, View Patterns, Pattern Synonyms, Strictness, ...)
- etc.

これらのアルゴリズムには紙とペンによる正当性の証明も大体ついています．嬉しいですね．

しかし，アルゴリズムの**実装**はどうでしょうか？いくら紙とペンによる正当性の証明があったとしても，実装が間違っていては不適切なエラーを出してしまったり，エラーを見逃してしまったりする可能性があります．
実際，RustのGitHubリポジトリをのぞいてみると，カバレッジ検査に関するバグがいくつか見つかります．

<https://github.com/rust-lang/rust/issues?q=is%3Aissue%20label%3AA-exhaustiveness-checking%20label%3AC-bug>

カバレッジ検査は重要な静的解析ですから，**実装まで含めて正しいことを検証したくなる**わけです．
調べてみると，検証付きコンパイラを含めて探してみても，検証付きカバレッジ検査アルゴリズムはほとんど見つかりません![^4]
そこで，自分がよく使っている証明支援系Agdaを用いて，カバレッジ検査アルゴリズムを形式化することにしました．
形式化するアルゴリズムとしてはMarangetのアルゴリズムを選びました．Marangetのアルゴリズムは比較的単純なので，形式化も実現しやすいと考えました．

## Marangetのアルゴリズムの概要

## 形式化のハイライト

## おわりに

形式化したコード全体を[GitHub](https://github.com/wasabi315/coverage-checking)で公開しています．HTMLに変換したコードもGitHub Pagesでホストしているので，興味があれば見てみてください．

<https://wasabi315.github.io/coverage-checking/>

[^1]: 去年のAdvent Calendarにこの記事を書くつもりだったのですが，完成しなかったため今年になってしまいました. 実はこの形式化について論文も書いていて，今後出版される予定です．Pre-printは[ここ](https://wasabi315.github.io/files/wctp2025a.pdf)で公開しています．
[^2]: [Luc Maranget, Warnings for Pattern Matching](https://doi.org/10.1017/S0956796807006223)
[^3]: [Sebastian Graf, Simon Peyton Jones, and Ryan G. Scott, Lower your guards](https://doi.org/10.1145/3408989)
[^4]: Concurrent workである[Cohen, A Mechanized First-Order Theory of Algebraic Data Types with Pattern Matching](https://doi.org/10.4230/LIPIcs.ITP.2025.5)以外には見つかりませんでした．
