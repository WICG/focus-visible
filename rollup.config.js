import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/focus-ring.js',
  format: 'umd',
  dest: 'dist/focus-ring.umd.js',
  plugins: [
    resolve({ jsnext: true, main: true }),
    commonjs()
  ]
};