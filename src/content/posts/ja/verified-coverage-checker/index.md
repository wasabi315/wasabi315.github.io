---
title: "検証付きカバレッジ検査器"
description: "パターンマッチのCoverage CheckingアルゴリズムをAgdaで形式化した"
date: "2025-12-18"
tags: ["agda", "agda2hs", "coverage-checking"]
---

この記事は[証明支援系 Advent Calendar 2025](https://adventar.org/calendars/11438)の18日目の記事です．

<https://adventar.org/calendars/11438>

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

- $\mathcal{U}_\mathrm{rec}$[^2]
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
そこで，自分がよく使っている証明支援系であるAgdaを用いて，カバレッジ検査アルゴリズムを形式化し検証付き実装を得ることにしました．

実装するアルゴリズムとしては $\mathcal{U}_\mathrm{rec}$ を選びました． $\mathcal{U}_\mathrm{rec}$ は比較的単純なので，証明支援系での形式化も実現しやすいと考えました．今後，より複雑な，あるいは効率的なアルゴリズムを形式化する際の基盤にもなりそうです．

## $\mathcal{U}_\mathrm{rec}$ の概要

### $\mathcal{U}_\mathrm{rec}$ の扱う体系

上述の通り，$\mathcal{U}_\mathrm{rec}$ は比較的単純な体系を扱います．
具体的には，値として代数的データ型のもののみを考え，パターンとしてはワイルドカードパターン，コンストラクタパターン，Orパターンの三種類だけを考えます．
カバレッジ検査の際は，変数パターンはワイルドカードパターンとして扱えばいいです．
$c$ から始まるものをコンストラクタ，$u$ や $v$, $w$ から始まるものを値とします．
また，$p$ や $q$, $r$ から始まるものをパターンとします．

```math
\begin{array}{rcl}
u , v, w & \Coloneqq & c(v_1, \cdots, v_n) \\
p, q, r & \Coloneqq & \_ \\
  & | & c(p_1, \cdots, p_n) \\
  & | & (p \mid q) \\
\end{array}
```

値ベクタ $(v_1, \cdots, v_n)$ とパターンベクタ $(p_1, \cdots, p_n)$ をそれぞれ $\overrightarrow{v}$ と $\overrightarrow{p}$ と書き，パターン行列（パターンベクタが並んだもの）を $P$ と書くことにします．パターン行列の各行が `match` 式の各ケースを表しています．

マッチすることを表す二項関係 $\preceq$ も導入しておきます[^8]．
（単一の）値がパターンにマッチする関係は以下のように標準的に定義されます．

```math
\begin{array}{rclcl}
  v & \preceq & \_ \\
  c(v_1, \cdots, v_n) & \preceq & c(p_1, \cdots, p_n) & \iff & (v_1, \cdots, v_n) \preceq (p_1, \cdots, p_n) \\
  v & \preceq & (p \mid q) & \iff & v \preceq p\ \ \text{or}\ \ v \preceq q
\end{array}
```

値ベクタがパターンベクタにマッチするのは，対応する要素がそれぞれマッチする時です． 特に，長さが0の値ベクタは長さ0のパターンベクタにマッチします．

```math
(v_1, \cdots, v_n) \preceq (p_1, \cdots, p_n) \iff \forall\ i \in \{1, \cdots, n\},\ v_i \preceq p_i
```

さらに，値ベクタがパターン行列のいずれかの行にマッチすることを，値ベクタとパターン行列の間のマッチ関係として定義します．

```math
\overrightarrow{v} \preceq P \iff \text{there exists a row } P_i \text{ in } P \text{ such that } \overrightarrow{v} \preceq P_i
```

明示されていませんが，値やパターンには型がついていて，$\preceq$ は同じ型の値とパターンに対してのみ定義されます．

例を見てみましょう．以下のリストのようなデータ型を考えます．

```ocaml
type mylist = Nil | One of unit | Cons of unit * mylist
```

そして，以下のパターン行列や値ベクタを考えます．

```math
\begin{array}{c}
  P = \begin{pmatrix}
    \texttt{Nil} & \texttt{\_} \\
    \texttt{\_} & \texttt{Nil}
  \end{pmatrix}\quad
  Q = \begin{pmatrix}
    \texttt{Nil} & \texttt{\_} \\
    \texttt{\_} & \texttt{Nil} \\
    \texttt{One(\_)} & \texttt{\_} \\
    \texttt{\_} & \texttt{One(\_)} \\
    \texttt{Cons(\_, \_)} & \texttt{\_} \\
    \texttt{\_} & \texttt{Cons(\_, \_)}
  \end{pmatrix} \\ \\
  \overrightarrow{u} = \begin{pmatrix}
    \texttt{Nil} & \texttt{Nil}
  \end{pmatrix}\quad
  \overrightarrow{v} = \begin{pmatrix}
    \texttt{One(Nil)} & \texttt{Nil}
  \end{pmatrix}\quad
  \overrightarrow{w} = \begin{pmatrix}
    \texttt{One(Nil)} & \texttt{One(Nil)}
  \end{pmatrix}
\end{array}
```

この時，$\overrightarrow{u} \preceq P$ かつ $\overrightarrow{v} \preceq P$ です．
それぞれ $P$ の第1行と第2行にマッチするからです．
一方で $\overrightarrow{w} \npreceq P$ です．
また，$\overrightarrow{u}, \overrightarrow{v}, \overrightarrow{w} \preceq Q$ であることもわかります．

### パターンの有用性

実は $\mathcal{U}_\mathrm{rec}$ は網羅性でも非冗長性でもなく*有用性*と呼ばれる性質を検査するアルゴリズムです．有用性の定義は以下のようになっています．

- 定義（有用性）：パターンベクタ $\overrightarrow{p}$ がパターン行列 $P$ に対して有用である ( $\mathcal{U}(P, \overrightarrow{p})$ と書く) とは，以下の条件を満たすことである
  1. ある値ベクタ $\overrightarrow{v}$ が存在して
  2. $P$ のどの行にも $\overrightarrow{v}$ がマッチせず ($\overrightarrow{v} \npreceq P$)
  3. $\overrightarrow{v}$ が $\overrightarrow{p}$ にマッチする ($\overrightarrow{v} \preceq \overrightarrow{p}$)

先ほどの例を引き続き用いて，有用性の例を見てみましょう．$P$ に対して $\overrightarrow{p} = (\texttt{\_}\ \ \texttt{\_})$ （ワイルドカードパターンのベクタ）は有用です．なぜなら，先ほどの $\overrightarrow{w} = (\texttt{One(Nil)}\ \ \texttt{One(Nil)})$ が証拠となるから（$\overrightarrow{w} \npreceq P$ かつ $\overrightarrow{w} \preceq \overrightarrow{p}$ が成り立つから）です．
また，$Q$ の 第1~5行目 がなす小行列に対して，$Q$ の第6行目は有用でないことも確かめられます．

では，なぜ有用性を考えるのでしょうか？ 網羅性と非冗長性のどちらもが有用性を使って言い換えられるからです！

- 補題
  1. $P$ が網羅的 $\iff$ （適切な長さの）ワイルドカードパターンのベクタが $P$ に対して有用でない
  2. $P$ の第 $i$ 節が非冗長 $\iff$ 第 $i$ 節がそれより前の節たちに対して有用である

先ほどの有用性に関する二つの例は，それぞれ $P$ が網羅的でないことと $Q$ の第6行目が冗長であることを示していました．

この同値を利用することで，$\mathcal{U}_\mathrm{rec}$ さえあれば，それをもとに網羅性/非冗長性検査アルゴリズムを実装することができるのです．

### $\mathcal{U}_\mathrm{rec}$ の動作原理

では，$\mathcal{U}_\mathrm{rec}$ を詳しく見ていきましょう．$\mathcal{U}_\mathrm{rec}$ の仕様は以下です．

- 入力: パターン行列 $P$ とパターンベクタ $\overrightarrow{p}$
- 出力: 真偽値
- 仕様:
  - $P$ と $\overrightarrow{p}$ の対応する列の型が一致する
  - $\overrightarrow{p}$ が $P$ に対して有用な時に限り真を返す ( $\mathcal{U}_\mathrm{rec}(P, \overrightarrow{p}) = \mathrm{True} \iff \mathcal{U}(P, \overrightarrow{p})$ )

$\mathcal{U}_\mathrm{rec}$ は有用性の証拠となる値ベクタを探索するような動作をします．
$\overrightarrow{p}$ がどのようなパターンベクタであるかで場合分けしていき，有用性の証拠となる値ベクタを絞っていきます．
それに応じて，$P$ の行のうち，証拠の値ベクタにマッチしないことが確定した行を除外することで，問題を小さくします．あとはこの部分問題を再帰的に解けば良いという算段です．

#### $\overrightarrow{p}$ が空のベクタの場合

再帰のベースケースであり，最も単純な有用性問題を解くステップです．$P$ は長さ0のパターンベクタが並んだ0列のパターン行列になっています．
空のパターンベクタには空の値ベクタがマッチすることを思い出すと，$P$ が空行列(0行0列)であるかどうかを結果として返せば良いことがわかります．
$P$ が空行列である場合，空の値ベクタが有用性の証拠となるからです．
逆に $P$ が空行列でない場合，$() \preceq P$ なので $\overrightarrow{p}$ は有用でないと結論づけられます．

```math
\mathcal{U}_\mathrm{rec}(P, \begin{pmatrix} \end{pmatrix}) = \begin{cases}
   \mathrm{True} & \text{if } P \text{ has no rows} \\
   \mathrm{False} & \text{otherwise}
\end{cases}
```

#### $\overrightarrow{p}$ の先頭がOrパターンの場合

左右のパターンのどちらかを選んだ場合を再帰的に解き，その論理和を取れば良いです．

```math
\begin{align*}
&\mathcal{U}_\mathrm{rec}(
  P,
  \begin{pmatrix} (p_l \mid p_r) & p_2 & \cdots & p_n \end{pmatrix}
) = \\
&\quad\quad \mathcal{U}_\mathrm{rec}(
  P,
  \begin{pmatrix} p_l & p_2 & \cdots & p_n \end{pmatrix}
) \lor
\mathcal{U}_\mathrm{rec}(
  P,
  \begin{pmatrix} p_r & p_2 & \cdots & p_n \end{pmatrix}
)
\end{align*}
```

#### $\overrightarrow{p}$ の先頭がコンストラクタパターンの場合

$\overrightarrow{p}$ の先頭が $c(r_1, \cdots, r_m)$ である場合，証拠となる値ベクタの先頭も $c(v_1, \cdots, v_m)$ のようになっている必要があります．
したがって，$P$ の行のうち，先頭のパターンが $c'(\ \cdots)$ ($c'$ は $c$ と異なる) である行は除外できます．
この除外処理（*特殊化*と呼ばれる操作）を行う関数を $\mathcal{S}$ とすれば，$\mathcal{U}_\mathrm{rec}$ は以下のように定義できます．
コンストラクタパターンの中にネストしているパターンは展開されて $\overrightarrow{p}$ の頭にくっつけられます．

```math
\begin{align*}
&\mathcal{U}_\mathrm{rec}(
  P,
  \begin{pmatrix} c(r_1, \cdots, r_m) & p_2 & \cdots & p_n \end{pmatrix}
) = \\
&\quad\quad \mathcal{U}_\mathrm{rec}(
  \mathcal{S}(c, P),
  \begin{pmatrix} r_1 & \cdots & r_m & p_2 & \cdots & p_n \end{pmatrix}
)
\end{align*}
```

$\mathcal{S}$ の定義は以下のようになります．
行の先頭にOrパターンが現れた場合は，Orパターンを展開して二つの行に分けます．
また，ワイルドカードパターンは，コンストラクタ $c$ の引数の個数分だけのワイルドカードパターンに展開します．

```math
\begin{array}{c}
\mathcal{S}(c, \begin{pmatrix}
\end{pmatrix}) = \begin{pmatrix}
\end{pmatrix} \\
\mathcal{S}\left(c, \left(\begin{array}{c}
  \begin{matrix} (p_l \mid p_r) & p_2 & \cdots & p_n \end{matrix} \\
  P
\end{array}\right)\right) =
\mathcal{S}\left(c, \begin{pmatrix}
    \begin{matrix} p_l & p_2 & \cdots & p_n \end{matrix} \\
    \begin{matrix} p_r & p_2 & \cdots & p_n \end{matrix} \\
    P
  \end{pmatrix}
\right) \\
\mathcal{S}\left(c, \left(\begin{array}{c}
  \begin{matrix} c'(r_1, \cdots, r_m) & p_2 & \cdots & p_n \end{matrix} \\
  P
\end{array}\right)\right) = \begin{cases}
  \begin{pmatrix}
    \begin{matrix} r_1 & \cdots & r_m & p_2 & \cdots & p_n \end{matrix} \\
    \mathcal{S}(c, P)
  \end{pmatrix} & \text{if } c = c' \\
  \mathcal{S}(c, P) & \text{otherwise}
  \end{cases} \\
\mathcal{S}\left(c, \left(\begin{array}{c}
  \begin{matrix} \_ & p_2 & \cdots & p_n \end{matrix} \\
  P
\end{array}\right)\right) =
  \begin{pmatrix}
    \begin{matrix} \_ & \cdots & \_ & p_2 & \cdots & p_n \end{matrix} \\
    \mathcal{S}(c, P)
  \end{pmatrix}
\end{array}
```

#### $\overrightarrow{p}$ の先頭がワイルドカードパターンの場合

この場合では，先頭がコンストラクタパターンの場合とは違い，証拠となる値ベクタの先頭のコンストラクタが何であるかが $\overrightarrow{p}$ からは決まりません．
そのため，基本的には，あり得るコンストラクタで特殊化した問題を解いてその論理和をとる，総当たりの手法を用いる必要があります．

```math
\begin{align*}
&\mathcal{U}_\mathrm{rec}(
  P,
  \begin{pmatrix} \_ & p_2 & \cdots & p_n \end{pmatrix}
) = \\
&\quad\quad \bigvee_{c_k : \text{ Constructor}} \mathcal{U}_\mathrm{rec}(
  \mathcal{S}(c_k, P),
  \begin{pmatrix} \_ & \cdots & \_ & p_2 & \cdots & p_n \end{pmatrix}
)
\end{align*}
```

しかし，$P$ の情報を使うことで総当たりを避けられ，より効率的に解くことができる場合があります．
具体的には，「$P$ の1列目に欠けているコンストラクタ」があれば，それを単に値ベクタの先頭のコンストラクタとして決めてあげればいいです．
$P$ の1列目に現れるコンストラクタの集合 $\Sigma(P)$ は以下のようにして求められます．

```math
\begin{array}{c}
\Sigma(\begin{pmatrix}
\end{pmatrix}) = \emptyset \\
\Sigma\left(\left(\begin{array}{c}
  \begin{matrix} (p_l \mid p_r) & p_2 & \cdots & p_n \end{matrix} \\
  P
\end{array}\right)\right) =
\Sigma\left(\begin{pmatrix}
    \begin{matrix} p_l & p_2 & \cdots & p_n \end{matrix} \\
    \begin{matrix} p_r & p_2 & \cdots & p_n \end{matrix} \\
    P
  \end{pmatrix}
\right) \\
\Sigma\left(\left(\begin{array}{c}
  \begin{matrix} c(r_1, \cdots, r_m) & p_2 & \cdots & p_n \end{matrix} \\
  P
\end{array}\right)\right) = \Sigma(P) \cup \{c\} \\
\Sigma\left(\left(\begin{array}{c}
  \begin{matrix} \_ & p_2 & \cdots & p_n \end{matrix} \\
  P
\end{array}\right)\right) = \Sigma(P)
\end{array}
```

$\Sigma(P)$ に含まれていないコンストラクタ $c_\mathrm{miss}$ があったとします．
$c_\mathrm{miss}$ を証拠となる値ベクタの先頭のコンストラクタとして選んであげれば，
$P$ の行のうち先頭がワイルドカードパターンのもののみを考えれば良くなります．
なぜなら，先頭がコンストラクタパターンの行には，$c_\mathrm{miss}$ から始まる値ベクタがマッチしないはずだからです．

この除外処理を行う関数 $\mathcal{D}$ とすれば，$\overrightarrow{p}$ の先頭がワイルドカードパターンの場合の $\mathcal{U}_\mathrm{rec}$ は以下のように定義できます．

```math
\begin{align*}
&\mathcal{U}_\mathrm{rec}(
  P,
  \begin{pmatrix} \_ & p_2 & \cdots & p_n \end{pmatrix}
) = \\
&\quad\quad \begin{cases}
\mathcal{U}_\mathrm{rec}(
  \mathcal{D}(P),
  \begin{pmatrix} p_2 & \cdots & p_n \end{pmatrix}
) & \Sigma(P) \text{ is incomplete} \\
\bigvee_{c_k} \mathcal{U}_\mathrm{rec}(
  \mathcal{S}(c_k, P),
  \begin{pmatrix} \_ & \cdots & \_ & p_2 & \cdots & p_n \end{pmatrix}
) & \text{otherwise}
\end{cases}
\end{align*}
```

$\mathcal{D}$ の定義は以下のようになります．
$\mathcal{S}$ と同様に，先頭がOrパターンの場合はOrパターンを展開して二つの行に分けます．

```math
\begin{array}{c}
\mathcal{D}(\begin{pmatrix}
\end{pmatrix}) = \begin{pmatrix}
\end{pmatrix} \\
\mathcal{D}\left(\left(\begin{array}{c}
  \begin{matrix} (p_l \mid p_r) & p_2 & \cdots & p_n \end{matrix} \\
  P
\end{array}\right)\right) =
\mathcal{D}\left(\begin{pmatrix}
    \begin{matrix} p_l & p_2 & \cdots & p_n \end{matrix} \\
    \begin{matrix} p_r & p_2 & \cdots & p_n \end{matrix} \\
    P
  \end{pmatrix}
\right) \\
\mathcal{D}\left(\left(\begin{array}{c}
  \begin{matrix} c(r_1, \cdots, r_m) & p_2 & \cdots & p_n \end{matrix} \\
  P
\end{array}\right)\right) =
\mathcal{D}(P) \\
\mathcal{D}\left(\left(\begin{array}{c}
  \begin{matrix} \_ & p_2 & \cdots & p_n \end{matrix} \\
  P
\end{array}\right)\right) =
  \begin{pmatrix}
    \begin{matrix} p_2 & \cdots & p_n \end{matrix} \\
    \mathcal{D}(P)
  \end{pmatrix}
\end{array}
```

## 形式化のハイライト

形式化の中で重要な部分だけいくつか紹介します．

### 正当性証明

```agda
record OriginalUseful (P : PatternMatrix) (ps : Patterns) : Type where
  field
    witness : Values
    witness-does-not-match-P : witness ⋠ P
    witness-matches-ps : witness ≼ ps
```

```agda
record Useful (P : PatternMatrix) (ps : Patterns) : Type where
  field
    witness : Patterns
    P-witness-disjoint : ∀ {vs} → vs ≼ P → vs ≼ witness → ⊥
    ps-subsumes-witness : ∀ {vs} → vs ≼ witness → vs ≼ ps
```

```agda
decideUseful : (P : PatternMatrix) (ps : Pattern)
  → Either (Not (Useful P ps)) (Useful P ps)
```

### 停止性証明

停止性も重要な性質です．コンパイラがカバレッジ検査で無限ループしてしまうのは嬉しくないですよね．
しかし，元の論文では$\mathcal{U}_\mathrm{rec}$ の停止性の証明が与えられていませんでした．

$\mathcal{U}_\mathrm{rec}$ の停止性証明は結構トリッキーです．というのも，動作原理のパートで見たように，$\mathcal{U}_\mathrm{rec}$ が複雑な再帰構造を持つからです．構造的再帰ではないので整礎帰納法を使うことになりますが，それに用いる尺度を見つける上で以下の部分が困りものです．

1. $\mathcal{S}$ や $\mathcal{D}$ がOrパターンを展開する
2. $\mathcal{S}$ がワイルドカードパターンを複数のワイルドカードパターンに展開する

これらのせいで，単純なパターンの大きさは狭義減少しないどころか増加してしまうことまであります．最終的には，大まかに以下のようなアイデアで，停止性を証明することができました．

1. パターンの大きさはOrパターンを全部展開してから数える[^5]
2. ワイルドカードパターンを数えない
3. 2の結果としてサイズが減らなくなる場合が出てくるので，そのステップで減る別のサイズ（パターン行列の列数など）を組み合わせた辞書式順序を考える

### agda2hsによるHaskellへの変換

今回のゴールは検証付きカバレッジ検査器を得ることなので，Agdaのコードを実行可能な形式に持っていけるようにしたいです．
その方法として，今回は[agda2hs](https://github.com/agda/agda2hs)を使うことにしました．
agda2hsはAgdaのサブセットをなるべく元のコードに近いHaskellコードに変換するツールです．生成コードを読まれることを前提としているのが，Agdaに付属しているHaskellへのコンパイラとは違う点です．

agda2hsでは，Agdaのコードのどの部分をHaskellに変換するかを，[erasure](https://agda.readthedocs.io/en/latest/language/runtime-irrelevance.html)という機能を使って指定します．Agdaコード中で`@0`（または`@erased`）で注釈をつけた部分がHaskell側では消えているという具合です．例えば，型レベルで長さを保持するリストのようなデータ型（よくVectorと呼ばれる）を考えます．長さ部分を`@0`で注釈すると，コンパイル結果として得られるHaskellのデータ型はリストと全く同型なものになります．

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

このような調子で，カバレッジ検査を形式化したAgdaコードに`@0`をつけていくことで，直接Haskellで実装したものと大差ないコードを得られるようになります！

## おわりに

この記事では，Agdaを使って検証付きカバレッジ検査器を実装した話をしました．

今後は，今回の形式化をベースとして，より複雑/効率的なアルゴリズムを形式化していきたいと思います．
まずは，Rustで実装されている，網羅性と各節の非冗長性を一気に検査するように最適化されたバージョン[^6]の形式化に取り組みたいです．

形式化したコード全体を[GitHub](https://github.com/wasabi315/coverage-checking)で公開しています．
[haskellブランチ](https://github.com/wasabi315/coverage-checking/tree/haskell/lib/CoverageCheck)にはagda2hsで生成したHaskellコードも載せています．
さらに，HTMLに変換したコードもGitHub Pagesでホストしているので，興味があれば見てみてください．

<https://wasabi315.github.io/coverage-checking>

[^1]: 去年のAdvent Calendarにこの記事を書くつもりだったのですが，完成しなかったため今年になってしまいました. 実はこの形式化について論文も書いていて，今後出版される予定です．Pre-printは[ここ](https://wasabi315.github.io/files/wctp2025a.pdf)で公開しています．
[^2]: [Luc Maranget, Warnings for Pattern Matching](https://doi.org/10.1017/S0956796807006223). この論文はアルゴリズムをいくつか提案しており，$\mathcal{U}_\mathrm{rec}$ はその中の一番基本的なものです．
[^3]: [Sebastian Graf, Simon Peyton Jones, and Ryan G. Scott, Lower your guards](https://doi.org/10.1145/3408989)
[^4]: 自分の調べた限り，concurrent workである[Joshua M. Cohen, A Mechanized First-Order Theory of Algebraic Data Types with Pattern Matching](https://doi.org/10.4230/LIPIcs.ITP.2025.5)以外には見つかりませんでした．そしてこの論文も同様に先行研究が見当たらないことを主張しています．
[^5]: 実際はOrパターンの数もサイズに含めます．展開して数えたサイズだけではOrパターンのステップでサイズが減らなくなるからです．
[^6]: 現状では，網羅性検査と各節に対しての非冗長性検査を別々に行わなければならないので，節の数に比例した回数だけ $\mathcal{U}_\mathrm{rec}$ を呼び出すことになります．
[^8]: 元論文とオペランドを逆にしています．
