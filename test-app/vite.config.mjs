import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

export default defineConfig(({ mode }) => ({
  // must match rootURL in config/environment.js (GitHub Pages serves the demo there)
  base: mode === 'production' ? '/ember-gridstack/' : '/',
  plugins: [
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
}));
