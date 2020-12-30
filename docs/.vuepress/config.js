module.exports = {
  title: '前端笔记',
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
      }, {
          text: 'TypeScript',
          link: '/javascript/ts',
      }]
    }, {
        text: '框架',
        items: [{
            text: 'Vue',
            link: '/framework/vue',
        }, {
            text: 'Vue3源码解读',
            link: '/framework/vue3/',
        }, {
            text: 'React',
            link: '/framework/react',
        }]
    }, {
        text: '网络',
        items: [{
            text: 'HTTP',
            link: '/network/http',
        }]
    }, {
        text: '工程化',
        link: '/engineering/'
    }, {
      text: '进阶',
      items: [{
        text: '函数式编程',
        link: '/advance/functional',
      }, {
        text: '设计模式',
        link: '/advance/patterns',
      }, {
          text: '数据结构',
          link: '/advance/algorithm',
      }]
    }, {
        text: '全栈',
        items: [{
            text: 'Node',
            link: '/fullStack/node',
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
        '/javascript/ts': ['/javascript/ts'],
        '/advance/functional': ['/advance/functional'],
        '/advance/patterns': ['/advance/patterns'],
        '/advance/algorithm': ['/advance/algorithm'],
        '/network/http': ['/network/http'],
        '/engineering/': ['', '/engineering/webpack'],
        "/framework/react": ['/framework/react'],
        '/framework/vue3/': [
            '/framework/vue3/',
            '/framework/vue3/reactivity',
            '/framework/vue3/render',
            '/framework/vue3/api',
        ],
        '/framework/vue': ['/framework/vue'],
        '/fullStack/node': ['/fullStack/node']
    }
  }
}
