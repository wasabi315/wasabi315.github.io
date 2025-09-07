---
order: 3
title: "LkProver"
featuredImage: "./featured-image.png"
thumbnail: "./thumbnail.png"
description: "LKシーケントから導出木のLaTeXスニペットを自動生成するツール"
githubRepository: "wasabi315/LkProver"
---

LkProverはLKシーケントから導出木を計算し，対応するLaTeXスニペットに変換します．

<https://github.com/wasabi315/LkProver>

## 目次

## 使い方

[Dune](https://dune.build/)が必要です.

```ansi
dune exec bin/main.exe '|- ((p -> q) -> p) -> p'
```

上のコマンドは以下のLaTeXスニペットを出力します．

```latex
\begin{prooftree}
\AxiomC{}
\RightLabel{(axiom)}
\UnaryInfC{$p \vdash p, q$}
\RightLabel{($\rightarrow R$)}
\UnaryInfC{$\vdash p, p \rightarrow q$}
\AxiomC{}
\RightLabel{(axiom)}
\UnaryInfC{$p \vdash p$}
\RightLabel{($\rightarrow L$)}
\BinaryInfC{$(p \rightarrow q) \rightarrow p \vdash p$}
\RightLabel{($\rightarrow R$)}
\UnaryInfC{$\vdash ((p \rightarrow q) \rightarrow p) \rightarrow p$}
\end{prooftree}
```

## 入力形式

LkProverの入力となるシーケントの文法です．

```bnf
<sequent> ::= <expr> "⊢" <expr>
            | <expr> "|-" <expr>
            | <expr> "⇒" <expr>
            | <expr> "=>" <expr>
<expr>    ::= <var>
            | "⊥" | "_|_"
            | "¬" <expr> | "~" <expr> | "!" <expr>
            | <expr> "∧" <expr> | <expr> "/\" <expr> | <expr> "^" <expr> | <expr> "&" <expr>
            | <expr> "∨" <expr> | <expr> "\/" <expr> | <expr> "|" <expr>
            | <expr> "→" <expr> | <expr> "->" <expr>
            | "(" <expr> ")"
<var>     ::= [A-Za-z][A-Za-z0-9_]*
```

## 出力形式

現在は`busproofs`パッケージを使ったコードを出力します．
`proof.sty`など他のパッケージへの対応も検討しています．

## 推論規則

LkProverは僕が論理学の講義で習った以下の推論規則を採用しています．
![Inference rules](./inference-rules.png)

## 実装のハイライト

LkProverはOCamlで実装されています．実装は，上記の推論規則をなぞっていくだけで，非常に素直です．

レキサーとパーサーにはそれぞれ[sedlex](https://github.com/ocaml-community/sedlex)と[Menhir](http://cambium.inria.fr/~fpottier/menhir/)を使っています．
sedlexは初めて使ったのですが，体験がとても良かったです．Menhirと違って，sedlexはOCamlファイルの中に直接字句解析を書くスタイルのライブラリなので，OCaml Language Serverが効きます．
