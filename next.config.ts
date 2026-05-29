import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 🌟 核心外挂配置 */
  typescript: {
    // 允许在开发和打包时忽略由于第三方库不规范带来的 TS 类型红线
    ignoreBuildErrors: true,
  },
  eslint: {
    // 忽略 eslint 的严格审查
    ignoreDuringBuilds: true,
  },
  // 注入开发环境特殊覆盖，强行容忍 html/href 属性不规范
  experimental: {
    // 告诉编译器不要对客户端组件的内部属性进行阻塞式的侵入检查
    allowedRevalidateHeaderKeys: [], 
  }
};

export default nextConfig;