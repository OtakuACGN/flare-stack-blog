import { Loader2, Pin, PinOff, Sparkles } from "lucide-react";
import { useId } from "react";
import TextareaAutosize from "react-textarea-autosize";
import DatePicker from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { TagSelector } from "@/features/tags/components/tag-selector";
import { POST_STATUSES } from "@/lib/db/schema";
import { toLocalDateString } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import type { PostEditorData } from "./types";

const STATUS_LABELS: Record<PostEditorData["status"], () => string> = {
  draft: m.editor_status_draft,
  published: m.editor_status_published,
};

interface PostEditorMetadataProps {
  post: PostEditorData;
  isGeneratingSlug: boolean;
  isCalculatingReadTime: boolean;
  isGeneratingSummary: boolean;
  isGeneratingTags: boolean;
  onPostChange: (updates: Partial<PostEditorData>) => void;
  onGenerateSlug: () => void;
  onCalculateReadTime: () => void;
  onGenerateSummary: () => void;
  onGenerateTags: () => void;
}

export function PostEditorMetadata({
  post,
  isGeneratingSlug,
  isCalculatingReadTime,
  isGeneratingSummary,
  isGeneratingTags,
  onPostChange,
  onGenerateSlug,
  onCalculateReadTime,
  onGenerateSummary,
  onGenerateTags,
}: PostEditorMetadataProps) {
  const titleId = useId();
  const readTimeId = useId();
  const slugId = useId();
  const summaryId = useId();

  return (
    <>
      <div className="mb-12">
        <TextareaAutosize
          id={titleId}
          aria-label={m.editor_title_placeholder()}
          value={post.title}
          onChange={(e) => onPostChange({ title: e.target.value })}
          minRows={1}
          placeholder={m.editor_title_placeholder()}
          className="w-full resize-none overflow-hidden border-none bg-transparent p-0 text-4xl font-medium leading-[1.2] tracking-tight text-foreground transition-all placeholder:text-muted-foreground/20 focus:outline-none md:text-6xl font-serif"
        />
      </div>

      <div className="mb-16 grid grid-cols-1 gap-x-12 gap-y-8 border-t border-border/30 pt-8 md:grid-cols-3">
        <div className="space-y-3">
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
            {m.editor_meta_status()}
          </span>
          <div className="flex items-center gap-4">
            {POST_STATUSES.map((status) => (
              <button
                type="button"
                key={status}
                aria-pressed={post.status === status}
                onClick={() => onPostChange({ status })}
                className={`
                  text-[10px] font-mono uppercase tracking-wider transition-colors
                  ${
                    post.status === status
                      ? "border-b border-foreground font-bold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {STATUS_LABELS[status]()}
              </button>
            ))}
          </div>
        </div>

        {post.status === "published" && (
          <div className="space-y-3">
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
              {m.editor_meta_pin()}
            </span>
            <div>
              <button
                type="button"
                aria-pressed={!!post.pinnedAt}
                onClick={() =>
                  onPostChange({
                    pinnedAt: post.pinnedAt ? null : new Date(),
                  })
                }
                className={`
                  flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider transition-colors
                  ${
                    post.pinnedAt
                      ? "border-b border-foreground font-bold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {post.pinnedAt ? <Pin size={12} /> : <PinOff size={12} />}
                {post.pinnedAt
                  ? m.editor_meta_pinned()
                  : m.editor_meta_unpinned()}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
            {m.editor_meta_published_at()}
          </span>
          <div className="text-xs font-mono">
            <DatePicker
              value={
                post.publishedAt ? toLocalDateString(post.publishedAt) : ""
              }
              onChange={(dateStr) =>
                onPostChange({
                  publishedAt: dateStr
                    ? new Date(`${dateStr}T12:00:00Z`)
                    : null,
                })
              }
              className="h-auto! border-none! bg-transparent! p-0! text-xs text-foreground font-mono"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label
            htmlFor={readTimeId}
            className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground"
          >
            {m.editor_meta_read_time()}
          </label>
          <div className="group flex items-center gap-2">
            <Input
              id={readTimeId}
              type="number"
              value={post.readTimeInMinutes}
              onChange={(e) =>
                onPostChange({
                  readTimeInMinutes: Number.parseInt(e.target.value) || 0,
                })
              }
              className="h-auto w-12 border-none bg-transparent p-0 px-0 text-xs font-mono text-foreground shadow-none focus-visible:ring-0"
            />
            <span className="text-[10px] font-mono text-muted-foreground">
              {m.editor_meta_minutes()}
            </span>
            <button
              type="button"
              aria-label={`${m.editor_meta_auto_generate()} ${m.editor_meta_read_time()}`}
              onClick={onCalculateReadTime}
              disabled={isCalculatingReadTime}
              className="ml-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100"
            >
              {isCalculatingReadTime ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <Sparkles size={10} />
              )}
            </button>
          </div>
        </div>

        <div className="col-span-1 space-y-3 md:col-span-3">
          <label
            htmlFor={slugId}
            className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground"
          >
            {m.editor_meta_slug()}
          </label>
          <div className="group flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">
              /post/
            </span>
            <Input
              id={slugId}
              type="text"
              value={post.slug || ""}
              onChange={(e) => onPostChange({ slug: e.target.value })}
              className="h-auto flex-1 border-none bg-transparent p-0 px-0 text-xs font-mono text-foreground shadow-none placeholder:text-muted-foreground/30 focus-visible:ring-0"
              placeholder="your-post-slug"
            />
            <button
              type="button"
              aria-label={`${m.editor_meta_auto_generate()} ${m.editor_meta_slug()}`}
              onClick={onGenerateSlug}
              disabled={isGeneratingSlug}
              className="ml-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100"
            >
              {isGeneratingSlug ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <Sparkles size={10} />
              )}
            </button>
          </div>
        </div>

        <div className="col-span-1 space-y-3 md:col-span-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
              {m.editor_meta_tags()}
            </span>
            <button
              type="button"
              onClick={onGenerateTags}
              disabled={isGeneratingTags}
              className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground transition-colors hover:text-foreground"
            >
              {isGeneratingTags ? (
                <Loader2 size={8} className="animate-spin" />
              ) : (
                <Sparkles size={8} />
              )}
              {m.editor_meta_auto_generate()}
            </button>
          </div>
          <TagSelector
            value={post.tagIds}
            onChange={(tagIds) => onPostChange({ tagIds })}
          />
        </div>

        <div className="col-span-1 space-y-3 md:col-span-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor={summaryId}
              className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground"
            >
              {m.editor_meta_summary()}
            </label>
            <button
              type="button"
              onClick={onGenerateSummary}
              disabled={isGeneratingSummary}
              className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground transition-colors hover:text-foreground"
            >
              {isGeneratingSummary ? (
                <Loader2 size={8} className="animate-spin" />
              ) : (
                <Sparkles size={8} />
              )}
              {m.editor_meta_auto_generate()}
            </button>
          </div>
          <TextareaAutosize
            id={summaryId}
            value={post.summary || ""}
            onChange={(e) => onPostChange({ summary: e.target.value })}
            placeholder={m.editor_summary_placeholder()}
            className="w-full resize-none bg-transparent text-xs font-mono leading-relaxed text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
          />
        </div>
      </div>
    </>
  );
}
