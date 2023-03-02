import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: { target: ['es2020'] },
	optimizeDeps: {
		exclude: ['sqlite-wasm-esm'],
		esbuildOptions: { target: 'es2020' }
	}
});
