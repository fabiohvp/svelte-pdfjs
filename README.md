# Svelte-pdfjs

a simple way to render your pdfs.

`npm install @fabiohvp/svelte-pdfjs`  
or  
`yarn add @fabiohvp/svelte-pdfjs`

this package requires some additional settings on rollup.

1. You need to install **rollup-plugin-node-builtins** and **rollup-plugin-copy** (devDependencies)
2. Inside your rollup.config.js you need to import them and do as follow:

```
import builtins from "rollup-plugin-node-builtins";
import copy from "rollup-plugin-copy";
...

export default {
	...
	plugins: [
		...
		copy({
			targets: [
				{
					src: "node_modules/pdfjs-dist/build/pdf.worker.min.js",
					dest: "public/pdfjs"
				},
				{
					src: "node_modules/pdfjs-dist/cmaps/**/*",
					dest: "public/pdfjs/cmaps"
				}
			]
		}),
		...
		resolve({
			...
			preferBuiltins: true
		}),
		builtins(),
		...
	]
	...
};
```
