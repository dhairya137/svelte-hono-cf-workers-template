import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';

export default defineConfig({
	plugins: [
		svelte({
			// Disable Svelte 5 runes for compatibility with libraries
			compilerOptions: {
				runes: false
			}
		})
	],
	css: {
		postcss: {
			plugins: [tailwindcss(), autoprefixer()],
		},
	},
	resolve: {
		alias: {
			'$lib': resolve('./src/lib')
		}
	},
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
