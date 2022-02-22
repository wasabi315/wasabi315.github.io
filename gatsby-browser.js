import { Prism } from "prism-react-renderer"
;(typeof global !== "undefined" ? global : window).Prism = Prism

require("./src/styles/prism-wasabi.css")

require("prismjs/components/prism-haskell")
require("prismjs/components/prism-rust")
require("prismjs/components/prism-ocaml")
require("prismjs/components/prism-scheme")
