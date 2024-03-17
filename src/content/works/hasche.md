---
order: 1
title: "Hasche"
featuredImage: "../../images/hasche-featured-image.png"
thumbnail: "../../images/hasche-thumbnail.png"
description: "A Scheme-ish language written in Haskell"
githubRepository: "wasabi315/Hasche"
---

> Hasche (/hæʃ/): **Ha**skell + **Sche**me

Hasche is a toy Scheme-ish language written in Haskell with REPL, `call/cc`, pattern-matching, and non-hygienic macros.

## Contents

## Try It out!

[Cabal](https://www.haskell.org/cabal/) is required to build Hasche.

```ansi
$ git clone https://github.com/wasabi315/Hasche.git && cd Hasche
cabal build
```

The `exec` command is to execute a Scheme file.

```ansi
$ cabal exec hasche -- exec ./programs/hello.scm
Hello, world!
```

Hit the `repl` command to start a new REPL session and try Hasche interactively.

```ansi
$ cabal exec hasche -- repl
Welcome to the Hasche REPL!
enter :? for help

hasche> (+ 1 1)
2
hasche> (display "Hello, world!\n")
Hello, world!
```

## Features

### call/cc

The `call/cc` (`call-with-current-continuation`) procedure is available in Hasche.
What is `call/cc`? It is a procedure that captures the current continuation, the surrounding context of the call/cc, and passes it to the given procedure.
When the continuation is invoked with an argument, the existing continuation is abandoned and the invoked continuation is resumed.
In the example below, the surrounding context `(lambda (x) (display x))` is bound to the `k` parameter and is called with `1`, hence the output `1`. We can observe that `(lambda (x) (+ x 2))`, the continuation of `(k 1)`, is eliminated.

```scheme
hasche> (display (call/cc (lambda (k) (+ (k 1) 2))))
1
```

Continuations are first-class, that is, they can be passed to and returned from procedures and even stored in data structures.

```scheme
hasche> (define save '())
hasche> (display (call/cc (lambda (k) (set! save k))))  ; (lambda (x) (display x)) is bound to save
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

With call/cc we can implement non-local control flow, such as exceptions and generators.
For more examples check out the [programs directory](https://github.com/wasabi315/Hasche/tree/main/programs) in the repository.

### Pattern Matching

Pattern matching is one of the common features in functional programming languages, so why not in Hasche?
Use the `match` special form to perform pattern matching.

```scheme
(define nested-data '((1 2 3) (4 5 6)))

; displays 1
(match nested-data
  [((m . _) (4 5 6))
    (begin (display m) (newline))]
  [_
    (display "Failed to match\n")])
```

Two a bit unusual patterns are available: predicate patterns and rest patterns.
A predicate pattern is of the form `(? <predicate>)`. It matches if the predicate returns `#t` for the scrutinee. Predicate patterns can be sub-patterns, unlike Haskell's pattern guards or OCaml's when guards.

```scheme
; displays "m is not 0" as (= 2 0) is #f
(match nested-data
  [((_ (? (lambda (m) (= m 0))) _) . _)
    (display "m is 0\n")]
  [_
    (display "m is not 0\n")])
```

A rest pattern is of the form `(<pattern> ...)`. It matches if the given pattern matches all elements of the scrutinee. If the pattern contains variable patterns, they are bound to lists of the corresponding elements. In the example below, pattern matching succeeds since all elements of `nested-data` are lists of three elements. The variables `m`, `n`, and `o` are bound to lists of the first, second, and third elements of `nested-data`, respectively.

```scheme
(match nested-data
  [((m n o) ...)
    (begin
      (display m) (newline)     ; displays (1 4)
      (display n) (newline)     ; displays (2 5)
      (display o) (newline))])  ; displays (3 6)
```

Of course, rest patterns can also be nested.

```scheme
(define nested-data2 '(((1 2) (3 4)) ((5 6) (7 8) (9 10))))

(match nested-data2
  [(((m n) ...) ...)
    (begin
      (display m) (newline)     ; displays ((1 3) (5 7 9))
      (display n) (newline))])  ; displays ((2 4) (6 8 10))
```

### Non-hygienic Macros

Hasche supports macros. A macro takes a list of codes and returns a new code.
You can use the `define-macro` special form to define a macro.
For example, the `and` macro defined below expands to a series of `if` expressions.

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

Here `` ` `` (quasiquote), `,` (unquote), and `,@` (unquote-splicing) are used. Quasiquote is like quote, but it allows interpolation using unquote and unquote-splicing.
In fact, special forms such as `begin`, `let`, and `cond` are implemented using macros in [the standard library](https://github.com/wasabi315/Hasche/blob/5f391d708abe2c6209157637695951dd01283089/lib/stdlib.scm#L86), not built-in.
Thanks to the `match` and quasiquote, they can be implemented concisely.

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

Hasche's macros are non-hygienic, meaning that they do not perform variable capture avoidance.
Use `gensym` to generate a unique symbol and avoid variable capture.

```scheme
(define-macro (incr v)
  `(let ([x 1]) (set! ,v (+ ,v 1))))

(define x 0)

; expands to (let ([x 1]) (set! x (+ x 1))), making x shadowed!
(incr x)
(display x) (newline) ; displays 0

(define-macro (incr2 v)
  `(let ([,(gensym) 1]) (set! ,v (+ ,v 1))))

(incr2 x)              ; x is not shadowed this time
(display x) (newline)  ; displays 1
```

## Implementation

The interpreter is implemented as a simple tree-walking interpreter.
An interesting point is that syntax trees themselves are values that can be manipulated! Code as data!

The evaluator is implemented using the monad transformer stack `ReaderT Env (ContT r IO)`.
The `ReaderT` is for maintaining the environment, `ContT` is to implement `call/cc`, and `IO` is for I/O operations. `IO` is also used to generate `Unique` identifiers for each object, which is needed to emulate physical equality.

---

If you are interested, please check out the [repository](https://github.com/wasabi315/Hasche)!
