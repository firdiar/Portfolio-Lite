# Persona 3 Reload Portfolio Remake — Implementation Plan

## Overview
Complete rewrite of all 3 source files (index.html, css/style.css, js/main.js) to transform the portfolio into a Persona 3 Reload-inspired game menu system. Zero build tools, GitHub Pages compatible.

## Fonts Used (from Persona3-font/)
- **FOT-NewRodin Pro EB** — Main headings, dramatic text
- **FOT-NewRodin Pro B** — Sub-headings
- **FOT-NewRodin Pro M** — Body text
- **FOT-Rodin Pro B** — UI elements, menu labels
- **FOT-Skip Std B** — Special accent text ("PRESS START", stamps)

### Fonts to Remove (unused)
- FOT-NewRodin Pro DB.otf
- FOT-Rodin Pro DB.otf
- FOT-Rodin Pro EB.otf
- FOT-Rodin Pro L.otf
- FOT-Rodin Pro M.otf

## Color Palette
```
--bg-deep:      #050816        (near-black base)
--bg-dark:      #0a0e27        (midnight blue)
--bg-panel:     #0d1333        (panel backgrounds)
--accent:       #00e5ff        (teal/cyan — primary)
--accent-glow:  rgba(0,229,255,0.3)
--accent-red:   #ff2d55        (hover/danger)
--gold:         #ffd700        (trophy gold)
--silver:       #94a3b8        (trophy silver)
--text:         #e8eaf6        (light text)
--text-dim:     #7986cb        (muted text)
--border:       rgba(0,229,255,0.15)
```

## Architecture: Screen-Based Navigation (No Scrolling)

### Navigation Model
- Full-screen "panels" — each section is 100vh
- Only ONE screen visible at a time
- Persistent left side menu (vertical tabs with icons + labels)
- GSAP-powered transitions between screens (diagonal wipe effect)
- Keyboard navigation (arrow keys, number keys)
- Mobile: hamburger toggles side menu overlay

### 8 Screens
1. **Title Screen** (title) — Boot sequence, glitch name reveal, "PRESS START"
2. **Status** (status) — RPG character sheet with portrait + stats + education
3. **Skills** (skills) — Skill bars with "Lv." labels + attribute grid (S/A/B ranks)
4. **Chapters** (chapters) — Experience timeline as game chapters (CH.01-CH.06)
5. **Trophies** (trophies) — Achievement cards with gold/silver/special tiers + "UNLOCKED" stamps
6. **Social Links** (social) — Persona-style confidant cards with flip animation
7. **Compendium** (compendium) — Tabbed project catalog (Featured/Professional/Indie/Tools)
8. **Terminal** (terminal) — Hacker-style contact form with monospace terminal aesthetic

## File-by-File Implementation

### 1. index.html (Complete Rewrite)
- Remove Swiper.js CDN, add GSAP CDN
- New structure: scanlines overlay, canvas#particles, custom cursor divs, screen-transition div
- Side nav with 8 icon buttons + social links
- Mobile hamburger button
- 8 full-screen section elements with data-screen attributes
- Video modal preserved
- All content data preserved exactly

### 2. css/style.css (Complete Rewrite — ~1500+ lines)
Key sections:
- @font-face declarations (5 fonts from Persona3-font/)
- CSS custom properties (dark theme)
- Global reset + base styles
- Scanline overlay (repeating-linear-gradient)
- Vignette effect (radial-gradient)
- Custom cursor styles
- Screen transition overlay
- Side navigation menu
- Mobile menu button
- Screen base styles (100vh, hidden by default)
- Title screen (glitch animation, pulsing "PRESS START")
- Status screen (character sheet grid, portrait frame, stat boxes)
- Skills screen (glowing bars, attribute cards with ranks)
- Chapters screen (chapter cards with number labels, ACTIVE/COMPLETE badges)
- Trophies screen (tier-colored cards, UNLOCKED stamps)
- Social Links screen (flip cards with tarot styling)
- Compendium screen (tabs, image cards with overlay, mini-list items)
- Terminal screen (terminal window with monospace aesthetic)
- Video modal (dark overlay)
- Responsive breakpoints (mobile adaptation)
- Animations (@keyframes for glitch, pulse, scanline, glow, typing)

### 3. js/main.js (Complete Rewrite — ~400+ lines)
Key modules:
- **Particle System** — Canvas-based floating geometric shapes (triangles, circles, hexagons)
- **Custom Cursor** — Crosshair that scales on hover over interactive elements
- **Screen Manager** — Navigate between screens, track current/previous, prevent double-transitions
- **GSAP Transitions** — Diagonal wipe effect using screen-transition overlay
- **Title Screen Boot** — Sequential glitch text reveal animation
- **Skill Bar Animation** — Animate fills when Skills screen becomes active
- **Social Card Flip** — Click to flip between front/back
- **Compendium Tabs** — Filter between project categories
- **Chapter Cards** — Hover expand effect
- **Trophy Cards** — Staggered reveal animation
- **Contact Form** — Terminal-style form handler (mailto/Gmail)
- **Video Modal** — YouTube iframe embed on play button click
- **Keyboard Navigation** — Arrow up/down to switch screens, Enter for actions
- **Mobile Menu** — Toggle side menu overlay on mobile
- **"PRESS START"** — Navigates to Status screen

## Visual Effects Implemented
1. Canvas particle background (floating geometric shapes in teal/cyan)
2. CSS scanline overlay (semi-transparent horizontal lines)
3. CRT vignette effect (dark radial gradient at edges)
4. Custom crosshair cursor
5. Glitch text animation (RGB split + jitter)
6. Pulsing "PRESS START" text
7. Screen transition wipe (diagonal mask reveal)
8. Glowing skill bars with animated fill
9. Social card 3D flip on click
10. Trophy "UNLOCKED" stamp animation
11. Terminal blinking cursor
12. Hover glow effects on all interactive elements
13. Staggered card reveal animations per screen

## Content Preserved (All Data Identical)
- Personal info (name, email, phone, location, socials)
- 6 experience entries
- 5 skills with percentages
- 1 education record
- 7 achievements
- 6 recommendations (with full quotes)
- 22 projects (4 featured + 5 professional + 10 indie + 3 tools)
- All external links
- All image assets

## Dependencies
- GSAP 3.12 (CDN: cdn.jsdelivr.net)
- Custom Persona 3 fonts (local, from Persona3-font/)
- No Swiper.js (removed)
- No other libraries

## Testing
- Open index.html directly in browser
- Verify all 8 screens navigate correctly
- Test keyboard navigation
- Test mobile hamburger menu
- Test video modal
- Test contact form
- Test all external links
- Test responsive at 768px and 480px breakpoints
