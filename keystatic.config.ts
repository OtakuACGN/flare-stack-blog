// keystatic.config.ts
// Enhanced with proper slug validation and UI branding
// Inspired by flare-stack-blog's blog.config.ts separation of concerns

import { config, fields, collection } from "@keystatic/core";

const isProd = process.env.NODE_ENV === "production";

export default config({
  storage: isProd
    ? {
        kind: "github",
        repo: "OtakuACGN/otaku-blog",
      }
    : {
        kind: "local",
      },
  ui: {
    branding: {
      applicationName: "YT Blog CMS",
    },
  },
  collections: {
    posts: collection({
      label: "\ud83d\udcdd 博客文章",
      slugField: "slug",
      path: "content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.text({
          label: "\ud83d\udccc 标题",
          description: "展示在博客前端的中文标题",
        }),
        slug: fields.text({
          label: "\ud83d\udd17 Slug",
          description: "英文/拼音/数字，如: my-first-post",
          validation: { format: { rule: "slug" } },
        }),
        publishedAt: fields.date({
          label: "\ud83d\udcc5 发布日期",
        }),
        pinnedAt: fields.date({
          label: "\ud83d\udccd 置顶日期",
          description: "设置后文章将显示在首页顶部（可选）",
        }),
        coverImage: fields.image({
          label: "\ud83d\uddbc\ufe0f 封面图",
          directory: "public/images/posts",
          publicPath: "/images/posts/",
        }),
        summary: fields.text({
          label: "\ud83d\udcac 摘要",
          multiline: true,
        }),
        content: fields.markdoc({
          label: "\u270d\ufe0f 正文",
        }),
      },
    }),
  },
});
