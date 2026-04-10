import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
<<<<<<< HEAD
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: 'index.html', // for SPA mode
			precompress: false,
			strict: true
		})
=======
	kit: {
		adapter: adapter({
			pages: 'www',
			assets: 'www',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		prerender: {
			entries: ['*']
		}
>>>>>>> e8a02607 (feat: implement requirements from Issue #3)
	}
};

export default config;
