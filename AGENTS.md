<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## CSS

When adding or editing CSS in this repo:

- **Reuse what exists** — Read global styles (e.g. `src/app/globals.css`), layout parents, and nearby modules before writing new rules. Avoid duplicating tokens, resets, or patterns already defined elsewhere.
- **No no-op or redundant properties** — Do not restate values that already apply from the cascade (for example, `box-sizing: border-box` is set globally—do not repeat it in module CSS unless you are deliberately overriding).
- **Spacing: prefer `gap`** — For flex and grid layouts, use `gap` (aligned with existing spacing) instead of one-off `margin` on children to separate items.
