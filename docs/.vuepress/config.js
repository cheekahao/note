module.exports = {
  title: '学习笔记',
  base: '/learning/',
  description: 'learning notebook of cheeka',
  themeConfig: {
    nav: [{
      text: '首页',
      link: '/'
    }, {
      text: 'JavaScript',
      items: [{
        text: 'ES6',
        link: '/javascript/es6/',
      }]
    }, {
      text: 'Github',
      link: 'https://github.com/cheekahao/learning',
      target: '_blank'
    }],
    sidebar: {
      '/javascript/es6': ['/javascript/es6']
    }
  }
}