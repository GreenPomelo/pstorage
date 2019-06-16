import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'umd',
    name: 'pstorage'
  },
  plugins: [babel(), resolve(), uglify()]
};
