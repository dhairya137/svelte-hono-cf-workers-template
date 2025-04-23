import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/vite-plugin-svelte').Config} */
const config = {
	// Consult https://svelte.dev/docs/preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	// Disable runes to make third-party libraries compatible
	compilerOptions: {
		runes: false
	},
  
	// Add the TypeScript config for JSX/TSX style element typings
	kit: {
		typescript: {
			config: (config) => {
				return {
					...config,
					compilerOptions: {
						...config.compilerOptions,
						jsx: 'preserve',
						jsxImportSource: 'svelte'
					}
				};
			}
		}
	}
};

export default config;
