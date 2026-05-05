# Accessibility Notes

This project includes several accessibility improvements so people can use the page with a keyboard, screen reader, or reduced-motion settings.

## Semantic Buttons

Interactive controls use real `<button>` elements where possible.

Examples:

```html
<button class="open-cart" type="button">
<button class="btn-add-to-cart" type="button">
<button class="btn-minus" type="button">
<button class="btn-plus" type="button">
```

Why this matters:

Buttons are naturally keyboard accessible. Users can focus them with `Tab` and activate them with `Enter` or `Space`. Screen readers also understand them as interactive controls.

## Icon-Only Button Labels

Some buttons only show icons visually, such as the cart, menu, close, previous, next, plus, and minus buttons. These buttons use `aria-label` so screen readers know what the button does.

Example:

```html
<button class="btn-minus" type="button" aria-label="Decrease quantity">
  <img src="images/icon-minus.svg" alt="" />
</button>
```

Why this matters:

An icon may be obvious visually, but a screen reader needs text. `aria-label` gives the button an accessible name.

## Decorative Icon Images

Images inside labelled buttons use empty alt text:

```html
<img src="images/icon-minus.svg" alt="" />
```

Why this matters:

If the button already has `aria-label="Decrease quantity"`, the icon image does not need to be announced. Empty `alt=""` tells screen readers to ignore the decorative image.

## Cart Button State

The cart button uses:

```html
aria-expanded="false"
aria-controls="cart-panel"
```

JavaScript updates `aria-expanded` when the cart opens or closes.

Why this matters:

Screen reader users can understand whether the cart panel is currently open or closed, and which element the button controls.

## Cart Live Status

The project includes a visually hidden live region:

```html
<span class="sr-only cart-status" aria-live="polite"></span>
```

JavaScript updates it when items are added or removed.

Why this matters:

Visual users can see the cart badge change. Screen reader users need a text announcement such as "2 items in cart." `aria-live="polite"` lets the screen reader announce updates without interrupting too aggressively.

## Hidden Content

The project uses the `hidden` attribute for elements that should not be available when closed, such as the cart panel.

CSS includes:

```css
[hidden] {
  display: none !important;
}
```

Why this matters:

Hidden content should not be visible or reachable by screen readers/keyboard users. The CSS rule makes sure custom display styles do not accidentally override the `hidden` attribute.

## Keyboard-Friendly Cart

The cart can be opened with the cart button and dismissed by clicking outside. The button state updates properly.

Why this matters:

This makes the cart behave like a small dropdown/popover. Users are not forced to use only the mouse in one specific way.

## Mobile Menu Buttons

The mobile navigation uses real buttons instead of relying on a hidden checkbox and labels.

Example:

```html
<button
  class="open-sidebar-button"
  type="button"
  aria-label="Open menu"
  aria-expanded="false"
  aria-controls="primary-navigation"
>
```

Why this matters:

A real button is easier for keyboard and screen reader users to operate. `aria-expanded` tells users whether the menu is open.

## Escape Key Support

JavaScript allows `Escape` to close interactive overlays such as the lightbox and mobile menu.

Why this matters:

Many keyboard users expect `Escape` to close popups, menus, dialogs, and overlays.

## Lightbox Dialog Semantics

When the lightbox opens, JavaScript adds:

```html
role="dialog"
aria-modal="true"
aria-label="Product image gallery"
```

Why this matters:

The lightbox visually behaves like a modal dialog. These attributes help assistive technologies understand that the user is now interacting with a focused dialog-like area.

## Lightbox Focus Management

When the lightbox opens, focus moves to the close button. When it closes, focus returns to the element that opened it.

Why this matters:

Keyboard users should not lose their place. If focus stayed behind the modal, users could become confused or interact with hidden/background content.

## Lightbox Focus Trap

The project includes basic focus trapping inside the lightbox. When users press `Tab`, focus cycles through the lightbox controls instead of moving into the page behind it.

Why this matters:

A modal should keep keyboard focus inside itself until it is closed.

## Lightbox Keyboard Navigation

The lightbox supports:

```txt
ArrowRight = next image
ArrowLeft = previous image
Escape = close lightbox
```

Why this matters:

Keyboard users can browse product images without needing a mouse.

## Thumbnail Button State

Generated thumbnail buttons use:

```html
aria-pressed="false"
```

JavaScript updates this value when the active thumbnail changes.

Why this matters:

Thumbnails behave like selectable buttons. `aria-pressed` helps screen readers understand which thumbnail is currently selected.

## Visible Focus Styles

The project has a global focus style:

```css
:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 4px;
}
```

Why this matters:

Keyboard users need to see where focus is on the page. `:focus-visible` shows the outline mainly when navigating by keyboard, without adding unnecessary outlines for mouse users.

## Reduced Motion Support

The project respects users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

Why this matters:

Some users experience discomfort from animations. This media query reduces transitions and animations for those users.

## Screen Reader Only Utility

The project includes an `.sr-only` utility class.

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
```

Why this matters:

Sometimes we need text for screen readers that should not be visible on the page. This class visually hides content while keeping it available to assistive technology.

## Summary

The main accessibility ideas used in this project are:

- Use real buttons for actions.
- Give icon-only buttons text labels.
- Hide decorative icons from screen readers.
- Show visible focus for keyboard users.
- Keep modal/lightbox focus controlled.
- Announce cart updates to screen readers.
- Respect reduced-motion preferences.
- Use ARIA only when native HTML is not enough.
