# Nigerian Entertainment News Portal - Design Guidelines

## Design Approach
**Reference:** Modern entertainment news sites (Complex, The Verge, Billboard) with emphasis on bold typography, vibrant energy, and content density. Priority on visual storytelling and rapid content consumption.

## Typography System
**Primary Font:** Inter or Manrope (Google Fonts) - clean, modern readability
**Accent Font:** Space Grotesk or Archivo Black - bold headlines, dramatic impact

**Hierarchy:**
- Hero Headlines: 4xl to 6xl, bold/black weight
- Article Headlines: 2xl to 3xl, bold
- Section Headers: xl to 2xl, semibold
- Body Text: base, regular (leading-relaxed for readability)
- Tags/Meta: sm, medium
- Captions: xs to sm

## Layout System
**Spacing Units:** Tailwind 4, 6, 8, 12, 16 for consistent rhythm
**Container:** max-w-7xl with px-4/6/8 responsive padding
**Grid System:** 12-column for desktop flexibility, stack mobile

## Core Components

**Navigation**
- Sticky header with logo left, category links center, search/social right
- Mobile: Hamburger with slide-in menu
- Category pills: Entertainment, Music, Celebrity, Trending, Videos
- Social icons (Twitter, Instagram, Facebook, YouTube) in header

**Hero Section**
- Full-width featured story with large hero image
- Text overlay (bottom-left) with gradient backdrop
- Category tag + headline + excerpt + author/time
- Height: 70vh desktop, 50vh mobile

**Article Cards (Multiple Layouts)**
- Large Featured: Image-first with headline overlay
- Medium Grid: 3-column desktop, 2-column tablet, 1-column mobile
- List View: Thumbnail left, content right (trending sidebar)
- All cards include: Category tag, headline, excerpt (optional), timestamp, comment count

**Trending Sidebar**
- Fixed-width right column (desktop only)
- "Trending Now" header
- Numbered list (1-10) with small thumbnails
- Compact article titles with view counts

**Category Sections**
- Section header with "View All" link
- Mixed layout: 1 large + 4 small grid per section
- Visual hierarchy through size variation

**Footer**
- 4-column layout: About, Categories, Newsletter, Social
- Newsletter signup: Input + vibrant CTA button
- Copyright, privacy links bottom

## Images

**Hero Image:** Large entertainment/celebrity photo - dramatic, high-energy (70vh height, full-width)
**Article Cards:** Mix of celebrity photos, concert shots, music artwork (16:9 ratio standard)
**Trending Thumbnails:** Square crops (1:1) for consistency
**Ad Placements:** Consider 300x250 sidebar blocks, 728x90 leaderboard positions

**Image Treatment:** Slight overlay gradients on hero/cards for text legibility, subtle hover zoom effects on cards

## Navigation & Interactions
- Infinite scroll or "Load More" for article feeds
- Category filtering (smooth transitions)
- Share buttons on articles (floating or inline)
- Minimize animations - focus on fast content loading

**Buttons on Images:** Blur background (backdrop-blur-sm), white/light text, subtle shadow for depth

## Special Elements
- "Breaking News" banner (top of page when needed)
- Social share counts on articles
- Author bylines with avatars
- Video play overlays on video content cards
- Comment counts, reading time indicators

**No Large Hero Image Alternative:** If hero-less layout needed, use magazine-style grid with 1 dominant story + 4-6 supporting stories in varied sizes immediately visible.