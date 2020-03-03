import builtins from "rollup-plugin-node-builtins";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import pkg from "./package.json";

const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
	.replace(/^\w/, m => m.toUpperCase())
	.replace(/-\w/g, m => m[1].toUpperCase());

export default {
	input: "src/index.svelte",
	output: [
		{ file: pkg.module, format: "es" },
		{ file: pkg.main, format: "umd", name }
	],
	plugins: [
		postcss(),
		svelte(),
		resolve({
			browser: true,
			preferBuiltins: true
		}),
		builtins(),
		commonjs()
	]
};
