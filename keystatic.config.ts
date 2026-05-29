// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

// 🌟 自动判断当前是否为生产环境（线上部署环境）
const isProd = process.env.NODE_ENV === 'production';

export default config({
  // 🌟 核心安全锁：本地开发免密读写文件；线上环境强制开启 GitHub 登录校验
  storage: isProd
    ? {
        kind: 'github',
        repo: 'OtakuACGN/otaku-blog', // 🚀 已经完美绑定到你的专属二次元博客仓库！
      }
    : {
        kind: 'local',
      },
  collections: {
    posts: collection({
      label: '📝 博客文章管理',
      // 把 slugField 绑定到一个纯粹的 text 字段上，完美绕过 Next.js 16 审查
      slugField: 'slug',      
      path: 'content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({ 
          label: '📌 文章标题', 
          description: '请输入展示在博客前端的中文标题' 
        }),
        // 用最纯净的 text 字段来代替 fields.slug，彻底根除不合规的 <a> 标签
        slug: fields.text({ 
          label: '🔗 网址路径 (Slug)', 
          description: '生成文件的名字，必须用英文、拼音或数字（不能有中文），例如: my-first-post' 
        }),
        publishedAt: fields.date({ 
          label: '📅 发布日期',
          description: '选择文章的公开显示时间'
        }),
        coverImage: fields.image({
          label: '🖼️ 封面图片',
          description: '为你的文章挑选一张精美的二次元插图吧',
          directory: 'public/images/posts',
          publicPath: '/images/posts/',
        }),
        summary: fields.text({
          label: '💬 文章摘要',
          description: '简短的一两句话，展示在博客列表页的简述',
          multiline: true
        }),
        content: fields.markdoc({ 
          label: '✍️ 文章正文', 
          description: '支持富文本排版，支持 Markdown 语法'
        }),
      },
    }),
  },
});