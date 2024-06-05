import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import eslint from 'vite-plugin-eslint';

export default defineConfig(() => {
	return {
		build: {
			outDir: 'build',
		},
		plugins: [
			react(),
			// svgr options: https://react-svgr.com/docs/options/
			svgr({ svgrOptions: { icon: true } }),
			eslint()
		],
		test: {
			globals: true,
			environment: 'jsdom',
			setupFiles: './tests/setup.ts',
		},
		server: {
			port: 3006,
			open: true
		}
	};
});
