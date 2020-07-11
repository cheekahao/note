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
        link: '/javascript/es6',
      }, {
        text: 'JS拾遗',
        link: '/javascript/omission',
      }]
    }, {
      text: '进阶',
      items: [{
        text: '函数式编程',
        link: '/advance/functional',
      }, {
        text: '设计模式',
        link: '/advance/patterns',
      }]
    }, {
      text: 'Github',
      link: 'https://github.com/cheekahao/learning',
      target: '_blank'
    }],
    sidebarDepth: 2,
    sidebar: {
      '/javascript/es6': ['/javascript/es6'],
      '/javascript/omission': ['/javascript/omission'],
      '/advance/functional': ['/advance/functional'],
      '/advance/patterns': ['/advance/patterns']
    }
  }
}