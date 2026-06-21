import DOMPurify from "isomorphic-dompurify";
import { resolveMediaAbsoluteUrl } from "@/lib/seo";

const ALLOWED_TAGS = [
  "p",
  "h2",
  "h3",
  "h4",
  "strong",
  "em",
  "u",
  "s",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "br",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "hr",
  "figure",
  "figcaption",
  "pre",
  "code",
];

const ALLOWED_ATTR = [
  "href",
  "src",
  "alt",
  "title",
  "target",
  "rel",
  "class",
  "colspan",
  "rowspan",
  "width",
  "height",
];

function fixMediaUrls(html: string): string {
  return html.replace(
    /(src=["'])([^"']+)(["'])/gi,
    (_match, prefix: string, url: string, suffix: string) => {
      if (!url.includes("/media/") && !url.includes("/django-media/")) {
        return `${prefix}${url}${suffix}`;
      }

      const absolute = resolveMediaAbsoluteUrl(url);
      return absolute ? `${prefix}${absolute}${suffix}` : `${prefix}${url}${suffix}`;
    },
  );
}

function sanitizeRichHtml(content: string): string {
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });

  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });

  DOMPurify.removeHook("afterSanitizeAttributes");

  return fixMediaUrls(sanitized);
}

function isRichHtml(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

type Props = {
  content: string;
  className?: string;
};

export function RichTextContent({ content, className = "" }: Props) {
  if (!isRichHtml(content)) {
    return (
      <div
        className={`glass-panel article-content article-content--plain px-6 py-6 text-sm leading-8 text-muted sm:px-8 ${className}`}
      >
        {content}
      </div>
    );
  }

  const html = sanitizeRichHtml(content);

  return (
    <div
      className={`glass-panel article-content px-6 py-6 sm:px-8 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
