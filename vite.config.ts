import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		svelte({
			// Enable Svelte 5 runes
			compilerOptions: {
				runes: true
			}
		})
	],
	build: {
		outDir: 'dist',
		assetsInlineLimit: 0, // Don't inline assets as base64
		sourcemap: true, // Enable sourcemaps for debugging
		rollupOptions: {
			// Ensure main.ts is the primary entry point
			input: 'index.html',
			output: {
				manualChunks: undefined // Keep chunks together for smaller files
			}
		},
		// Make sure we're generating clean asset paths
		minify: true
	}
});
