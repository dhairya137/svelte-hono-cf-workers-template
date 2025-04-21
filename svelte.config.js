import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/vite-plugin-svelte').Config} */
const config = {
	// Consult https://svelte.dev/docs/preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	// Enable the Svelte 5 compiler features
	compilerOptions: {
		runes: true
	}
};

export default config;
