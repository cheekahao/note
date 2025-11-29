import { defineConfig } from 'vitepress'

export default defineConfig({
    title: '前端进阶笔记',
    description: '每天进步一点点',

    // 外观配置 - 科技感主题
    appearance: true,

    // 基础配置
    base: '/',

    // 头部配置
    head: [
        ['meta', { name: 'theme-color', content: '#0f172a' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ],

    themeConfig: {
        nav: [{
            text: '首页',
            link: '/'
        }, {
            text: '前端之基',
            items: [{
                text: 'css',
                link: '/fe/css',
            }, {
                text: 'ES6',
                link: '/javascript/es6/',
            }, {
                text: 'JS拾遗',
                link: '/javascript/omission',
            }, {
                text: 'TypeScript',
                link: '/javascript/ts',
            }, {
                text: 'Vue3',
                link: '/framework/vue3/',
            }, {
                text: 'React',
                link: '/framework/react',
            }, {
                text: '工程化',
                link: '/engineering/'
            }]
        }, {
            text: '进阶之路',
            items: [{
                text: '函数式编程',
                link: '/advance/functional',
            }, {
                text: '低代码',
                link: '/low-code/'
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
                text: '算法',
                link: '/advance/leet-code',
            }, {
                text: '网络',
                link: '/network/http',
            }, {
                text: 'Node垃圾回收',
                link: '/node/garbage-collection',
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

        sidebar: {
            '/javascript/es6/': [
                { text: 'ES6概述', link: '/javascript/es6/' },
                { text: 'Set和Map', link: '/javascript/es6/set-map' },
                { text: 'Proxy', link: '/javascript/es6/proxy' },
                { text: '模块化', link: '/javascript/es6/module' }
            ],
            '/network/http': [{ text: 'HTTP', link: '/network/http' }, { text: '缓存', link: '/network/caching' }],
            '/engineering/': [
                { text: '工程化概述', link: '/engineering/' },
                { text: 'Webpack', link: '/engineering/webpack' },
                { text: 'Rollup', link: '/engineering/rollup' },
                { text: 'Vite', link: '/engineering/vite' }
            ],
            '/framework/react': [{ text: 'React', link: '/framework/react' }],
            '/framework/vue3/': [
                { text: 'Vue3概述', link: '/framework/vue3/' },
                { text: '响应式系统', link: '/framework/vue3/reactivity' },
                { text: '渲染系统', link: '/framework/vue3/render' },
                { text: '组件系统', link: '/framework/vue3/component' },
                { text: '编译系统', link: '/framework/vue3/compiler' },
                { text: 'API设计', link: '/framework/vue3/api' },
                { text: 'Vue2', link: '/framework/vue3/vue' }
            ],
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/cheekahao/note' }
        ],

        // 科技感主题配置
        logo: '/logo.png',

        // 搜索配置
        search: {
            provider: 'local'
        },

        // 页脚配置
        footer: {
            message: 'Built with VitePress',
            copyright: 'Copyright © 2024 Cheeka Hao'
        },

        // 大纲配置
        outline: {
            level: 'deep',
            label: '本页导航'
        },

        // 最后编辑时间
        lastUpdated: {
            text: '最后更新于',
            formatOptions: {
                dateStyle: 'full',
                timeStyle: 'medium'
            }
        },

        // 返回顶部按钮
        returnToTop: true
    },

    markdown: {
        // VitePress内置支持mermaid图表，无需额外配置
        lineNumbers: true,
    },

    // Vite配置 - 优化科技感主题
    vite: {
    }
})
