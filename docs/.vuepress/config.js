module.exports = {
    title: '前端笔记',
    description: 'learning notebook of cheeka',
    themeConfig: {
        nav: [{
            text: '首页',
            link: '/'
        }, {
            text: '前端基础',
            items: [{
                text: 'css',
                link: '/fe/css',
            }]
        }, {
            text: 'JavaScript',
            items: [{
                text: 'ES6',
                link: '/javascript/es6/',
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
            }, {
                text: '缓存',
                link: '/network/caching',
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
                text: '软件架构',
                link: '/advance/architecture',
            }, {
                text: '数据结构',
                link: '/advance/algorithm',
            }, {
                text: 'LeetCode',
                link: '/advance/leet_code',
            }]
        }, {
            text: '全栈',
            items: [{
                text: 'Node',
                link: '/fullStack/node',
            }]
        }, {
            text: '计算机科学',
            items: [{
                text: '程序是怎么跑起来的',
                link: '/cs/program',
            }, {
                text: '编译原理',
                link: '/cs/compiler'
            }]
        }, {
            text: 'Github',
            link: 'https://github.com/cheekahao/learning',
            target: '_blank'
        }],
        sidebarDepth: 2,
        sidebar: {
            '/javascript/es6': [
                '/javascript/es6/',
                '/javascript/es6/set-map',
                '/javascript/es6/proxy',
                '/javascript/es6/module',
            ],
            '/javascript/omission': ['/javascript/omission'],
            '/javascript/ts': ['/javascript/ts'],
            '/advance/functional': ['/advance/functional'],
            '/advance/patterns': ['/advance/patterns'],
            '/advance/algorithm': ['/advance/algorithm'],
            '/advance/architecture': ['/advance/architecture'],
            '/network/http': ['/network/http',],
            '/network/caching': ['/network/caching'],
            '/engineering/': ['', '/engineering/webpack'],
            "/framework/react": ['/framework/react'],
            '/framework/vue3/': [
                '/framework/vue3/',
                '/framework/vue3/reactivity',
                '/framework/vue3/render',
                '/framework/vue3/api',
            ],
            '/framework/vue': ['/framework/vue'],
            '/fullStack/node': ['/fullStack/node'],
            "/cs/program": ['/cs/program'],
            '/cs/compiler': ['/cs/compiler'],
            '/fe/css': ['/fe/css'],
            '/advance/leet_code': ['/advance/leet_code']
        }
    }
}
