import builtins from "rollup-plugin-node-builtins";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import svelte from "rollup-plugin-svelte";

export default {
	input: "src/index.svelte",
	output: [
		{ dir: "dist", format: "es" },
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
