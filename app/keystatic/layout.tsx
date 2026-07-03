// app/keystatic/layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  // 🌟 这里只管原封不动传递 children，不加载 KeystaticApp
  return <>{children}</>;
}