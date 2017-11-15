import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/focus-ring.js',
  output: {
    file: 'dist/focus-ring.js',
    format: 'umd'
  },
  plugins: [resolve({ jsnext: true, main: true }), commonjs()]
};
