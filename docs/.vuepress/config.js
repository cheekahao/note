module.exports = {
  title: '学习笔记',
  base: '/learning/',
  dest: 'public',
  description: 'learning notebook of cheeka',
  themeConfig: {
    nav: [{
      text: '首页',
      link: '/'
    }, {
      text: 'JavaScript',
      link: '/javascript/',
      items: [{
        text: 'ES6',
        link: 'es6/',
      }]
    }],
    sidebar: {
      '/javascript/es6': ['/javascript/es6']
    }
  }
}