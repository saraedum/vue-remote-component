const devPresets = ['@vue/cli-plugin-babel/preset'];
const buildPresets = ['@babel/preset-env'];
const testPresets = [['@babel/preset-env', { targets: { node: 'current' } }]];
module.exports = {
  presets: (process.env.NODE_ENV === 'development' ? devPresets : process.env.NODE_ENV === 'test' ? testPresets : buildPresets),
};
