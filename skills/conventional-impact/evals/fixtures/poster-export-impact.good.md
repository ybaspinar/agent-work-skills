# Ticket Impact Summary

## One-line summary
Added browser-based poster export support for four print presets, making the poster generator usable for multiple common print formats without adding server-side processing.

## Problem
The poster generator only supported one export shape, which limited print use cases and would have required manual resizing outside the app.

## What changed
Poster export now supports A4, A3, 12x18, and square presets directly in the browser.

## Quantification
| Metric | Before | After | Change | Source |
|---|---:|---:|---:|---|
| Supported export presets | 1 | 4 | 1 -> 4 | export preset list |

## Validation
- Verified PNG export for A4.
- Verified PNG export for A3.
- Verified PNG export for 12x18.
- Verified PNG export for square.

## Release note
Poster export now supports A4, A3, 12x18, and square print presets directly in the browser.
