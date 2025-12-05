import { defineConfig } from 'rspress/config';
import mermaid from 'rspress-plugin-mermaid';

export default defineConfig({
    // 基础配置
    root: 'docs',
    title: '前端进阶笔记',
    description: '每天进步一点点',
    logo: '/images/logo.png',
    logoText: '前端进阶笔记',
    outDir: 'dist',
    themeConfig: {
        socialLinks: [
            {
                icon: 'github',
                mode: 'link',
                content: 'https://github.com/cheekahao/learning',
            },
        ],
        footer: {
            message: 'Copyright © 2024 Cheeka Hao',
        },
        // 导航栏和侧边栏将通过 _meta.json 文件自动生成
    },



    // 插件配置
    plugins: [mermaid()],

    // Markdown配置
    markdown: {
        checkDeadLinks: true,
        showLineNumbers: true,
    },
});

