/**
 * Matches `globals.css` `--max-width` (rem). CSS keeps `@media` literals; JS should
 * build query strings from this when using `matchMedia`.
 */
export const SECTION_LAYOUT_BREAKPOINT_REM = 59.5;

/** `SECTION_LAYOUT_BREAKPOINT_REM` in pixels when `1rem === 16px` (browser default). */
export const SECTION_LAYOUT_BREAKPOINT_PX_DEFAULT_ROOT =
  SECTION_LAYOUT_BREAKPOINT_REM * 16;

/** Edge slack so OS overscroll / float scrollTop doesn't trap slide navigation. */
export const SCROLL_BOUNDARY_EPS = 3;
