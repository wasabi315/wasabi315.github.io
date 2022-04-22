import { Plugin } from "unified";

/**
 * Adds source line numbers to rehype AST nodes
 */
declare const sourceLine: Plugin<[]>;

export = sourceLine;
