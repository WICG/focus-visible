module.exports = {
  env: {
    browser: true
  },
  // The only thing we want ESLint to do is yell at us if we accidentally use ES2015+.
  // This is because we don't want/need to use Babel in this project.
  // We specifically DO NOT want ESLint to try to enforce a style guide on us.
  // We use prettier for that.
  extends: ['prettier'],
  plugins: ['es5']
};
