---
order: 1
title: "Hasche"
featuredImage: "./featured-image.png"
thumbnail: "./thumbnail.png"
description: "Haskell製のSchemeインタプリタ"
githubRepository: "wasabi315/Hasche"
---

> Hasche (/hæʃ/): **Ha**skell + **Sche**me

HascheはHaskellで書かれたScheme(のような言語)のインタプリタです．REPL，パターンマッチ，非衛生的マクロ，`call/cc`，第一級継続が特徴です．

<https://github.com/wasabi315/Hasche>

## 目次

## 動かし方

Hascheを動かすには[Cabal](https://www.haskell.org/cabal/)が必要です．

```ansi
git clone https://github.com/wasabi315/Hasche.git
cd Hasche
cabal build
```

`exec`コマンドでSchemeファイルを実行できます．

```ansi
$ cabal exec hasche -- exec ./programs/hello.scm
Hello, world!
```

`repl`コマンドではREPLセッションでHascheを対話的に動かせます．

```ansi
$ cabal exec hasche -- repl
Welcome to the Hasche REPL!
enter :? for help

hasche> (+ 1 1)
2
hasche> (display "Hello, world!\n")
Hello, world!
```

## 特徴

### パターンマッチ

関数型言語としてはやはりパターンマッチが欲しいですよね．Hascheでは特殊形式`match`を使うとパターンマッチできます．

```scheme
(define nested-data '((1 2 3) (4 5 6)))

; 1 が表示される
(match nested-data
  [((m . _) (4 5 6))
    (begin (display m) (newline))]
  [_
    (display "Failed to match\n")])
```

HascheはLisp系言語以外ではあまり見かけないパターンを使えます．
一つは述語パターン`(? <predicate>)`です．マッチされる値に対して`<predicate>`を適用し`#t`が返ったらマッチ成功です．
HaskellやOCaml，Rustのガード節とは違って，述語パターンは他のパターンの中に入れ子にできます．

```scheme
(define nested-data '((1 2 3) (4 5 6)))

; (zero? 2) は #f なので "m is not 0" が表示される
(match nested-data
  [((_ (? zero?) _) . _)
    (display "m is 0\n")]
  [_
    (display "m is not 0\n")])
```

もう一つは残余パターン`(<pattern> ...)`です．マッチされる値がリストであり，かつ各要素が`<pattern>`にマッチする場合に，残余パターンのマッチも成功します．
`<pattern>`の中に変数パターンが含まれている場合，リストの各要素からその変数パターンに対応する値を集めたリストが変数に束縛されます．
下の例では，`nested-data`の要素が全て3要素のリストであるためパターンマッチが成功します．
そして，一番目，二番目，三番目を集めてできるリストがそれぞれ`m`，`n`，`o`に束縛されます．

```scheme
(define nested-data '((1 2 3) (4 5 6)))

(match nested-data
  [((m n o) ...)
    (begin
      (display m) (newline)     ; (1 4) が表示される
      (display n) (newline)     ; (2 5) が表示される
      (display o) (newline))])  ; (3 6) が表示される
```

リストが基本のデータ構造となっているLisp系言語だからこそのパターンですね．
もちろん，残余パターンも入れ子にできます．

```scheme
(define nested-data2 '(((1 2) (3 4)) ((5 6) (7 8) (9 10))))

(match nested-data2
  [(((m n) ...) ...)
    (begin
      (display m) (newline)     ; ((1 3) (5 7 9)) が表示される
      (display n) (newline))])  ; ((2 4) (6 8 10)) が表示される
```

### 非衛生的マクロ

Hashceは特殊形式`define-macro`によるマクロ定義をサポートしています．構文は`define`と同じです．
しかし，`define`で定義された手続きが値を操作するのに対し，`define-macro`で定義されたマクロはプログラムをリストとして受け取り，新しいプログラム(これもリスト)を返すようなもので，返されたプログラムは評価されます．
例えば，下に定義されている`and`マクロは連続した`if`に展開されてから評価されます．

```scheme
(define-macro (and . l)
  (match l
    (() #t)
    ((test1 . test2) `(if ,test1 (and ,@test2) #f))))

;    (and t1 t2 t3)
; => (if t1 (and t2 t3) #f)
; => (if t1 (if t2 (and t3) #f) #f)
; => (if t1 (if t2 (if t3 (and) #f) #f) #f)
; => (if t1 (if t2 (if t3 #t #f) #f) #f)
(and t1 t2 t3)
```

ここでは `` ` `` (backquote)，`,` (unquote)，そして`,@` (unquote-splicing)が使われています. これらはquoteに似ていますが，値を補間(interpolate)することができます.

Hashceでは，特殊形式の`begin`や`let`， `cond`はインタプリタに組み込まれものではなく，[標準ライブラリ](https://github.com/wasabi315/Hasche/blob/5f391d708abe2c6209157637695951dd01283089/lib/stdlib.scm#L86)にマクロとして実装されています.
上述したパターンマッチの機能とbackquoteのおかげで，これらの特殊形式を簡単に実装できました!

```scheme
; In lib/stdlib.scm
(define-macro (cond . clauses)
  (match clauses
    [()
      (error "cond with no arms")]
    [(('else body ...))
      `(begin ,@body)]
    [((pred body ...))
      `(if ,pred (begin ,@body))]
    [(('else _ ...) _ ...)
      (error "else is not allowed here")]
    [((pred body ...) rest ...)
      `(if ,pred (begin ,@body) (cond ,@rest))]
    [_
      (error "invalid cond syntax")]))
```

Hascheのマクロは非衛生的で，変数名の衝突を自動的に防ぐような機構が入っていません．
代わりに，ユニークなシンボルを生成する`gensym`を使って手動で変数名の衝突を防ぐことができます．

```scheme
(define-macro (incr v)
  `(let ([x 1]) (set! ,v (+ ,v 1))))

(define x 0)

; (let ([x 1]) (set! x (+ x 1))) に展開されるので，
; defineされたxがincrの中ではshadowingされてしまう
; 結果としてxは1増えず0のまま
(incr x)
(display x) (newline) ; 0 が表示される．

(define-macro (incr2 v)
  `(let ([,(gensym) 1]) (set! ,v (+ ,v 1))))

(incr2 x)              ; 今回はxはshadowingされない
(display x) (newline)  ; 1 が表示される
```

### `call/cc` と第一級継続

Schemeの特徴的な機能の一つに`call/cc` (`call-with-current-continuation`)があり，Hascheでもサポートされています．
`call/cc`はとても強力で，例外処理やジェネレータといった複雑な制御構造を実装するのに使えます．
`call/cc`は現在の継続(`call/cc`の呼び出しを取り囲む文脈)を取ってきて，それを実引数として与えられた手続きに渡します．
そして，その継続へは，引数を与えて呼び出すことで復帰することができます．
下の例では，`call/cc`の継続`(display ...)`が`k`に束縛され，`1`で`k`を呼び出しているので`...`の部分に`1`が渡り，結果として`1`が表示されます．`(k 1)`を取り囲んでいる`(+ ... 2)`が捨てられていることもわかりますね．

```scheme
hasche> (display (call/cc (lambda (k) (+ (k 1) 2))))
1
```

継続は第一級なので，手続きの入出力にしたり，データ構造に格納したりできます．

```scheme
hasche> (define save '())
hasche> (display (call/cc (lambda (k) (set! save k))))  ; (display ...) がsaveに保存される
#<undef>
hasche> save
#<continuation>
hasche> (save 1)
1
hasche> (save 2)
2
hasche> (save 3)
3
```

## 実装のハイライト

Hascheはシンプルなtree-walkingインタプリタです．
評価器はモナドスタック`ReaderT Env (ContT r IO)`で実装されています．
`ContT`が入っているので`call/cc`は簡単に実装できました．
