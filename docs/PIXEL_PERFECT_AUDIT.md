# Pixel-Perfect Design Audit

Comprehensive visual analysis comparing reference Slack UI to current implementation.

---

## LEFT ICON BAR

### Dimensions
- **Width**: 60px
- **Background**: `#1a1d21` (dark grey/black in Salesforce Activity) vs `#4a154b` (purple in reference 2)
- **Padding**: 16px top/bottom

### Logo
- **Size**: 32×32px approximately
- **Position**: Top, centered, 16px from top
- **Reference**: Salesforce cloud logo
- **Current**: Salesforce logo (correct)

### Nav Items
- **Icon size**: 20px
- **Padding**: 10px vertical, full width
- **Gap between items**: 2px
- **Hover**: `rgba(255,255,255,0.1)`
- **Active**: `rgba(255,255,255,0.15)`
- **Icons**: Home, DMs, Activity (Bell), Files (Folder), Later (Bookmark), Agentforce (Bot), More (3 dots)

### Notification Badges
- **Size**: 18px circle (or auto-width pill for 2+ digits)
- **Background**: `#e01e5a` (Slack red) or `#d92d20`
- **Position**: Top-right of icon, overlapping slightly
- **Text**: White, 11px, bold
- **Examples**: "231" on one item, "3" on Activity

### Bottom Items
- **Plus button**: 32×32px circle, border `rgba(255,255,255,0.3)`, centered icon 18px
- **Profile avatar**: 32×32px circle, initials or photo, 2px below Plus

---

## ACTIVITY SIDEBAR

### Dimensions
- **Width**: 260px
- **Background**: `#ffffff`
- **Border-right**: 1px solid `#e8e8e8`

### Header
- **Padding**: 12px 16px
- **Border-bottom**: 1px solid `#e8e8e8`
- **Title**: "Activity", 15px, semibold, `#1d1c1d`
- **Beta badge**: bg `#e8f4fc`, text `#1264a3`, 10px, padding 4px 8px, rounded 3px

### Filter Tabs (All / DMs)
- **Container**: padding 8px 12px, border-bottom 1px `#e8e8e8`
- **Button**: padding 6px 12px, 13px, medium weight
- **Active**: bg `#f8f8f8`, text `#1d1c1d`
- **Inactive**: text `#616061`, hover bg `#f8f8f8`
- **Plus button**: 16px icon, padding 6px, rounded

### Filter Bar
- **Icons**: Square (checkbox), Grid (layout), Filter, List
- **Icon size**: 14px
- **Padding**: 6px each button
- **Search box**: flex-1, bg `#f8f8f8`, rounded 6px, padding 6px 10px

### Channel List Items
- **Padding**: 8px 12px (reference looks tighter than ours - try 6px 10px)
- **Gap**: 8px between avatar and text
- **Hover**: bg `#f8f8f8`
- **Active**: bg `#f8f8f8` + 1px solid border `#e8e8e8` (inset shadow)

### Avatar
- **Size**: 32×32px
- **Shape**: Rounded square (4px border-radius) NOT fully circular
- **Background**: `#611f69` or other colors
- **Text**: 14px, semibold, white, uppercase first letter

### Text
- **Name**: 15px, medium (500), `#1d1c1d`, truncate
- **Preview**: 13px, `#616061`, truncate
- **Timestamp**: 12px, `#616061`, right-aligned

### Hover Actions (Copy, Link, More)
- **Size**: 12px icons
- **Opacity**: 0, show on hover
- **Padding**: 4px each

---

## CHANNEL AREA

### Channel Header

#### Dimensions
- **Height**: 49px
- **Padding**: 0 16px
- **Border-bottom**: 1px solid `#e8e8e8`

#### Channel Name
- **Font-size**: 18px
- **Weight**: 700 (bold)
- **Color**: `#1d1c1d`

#### Icons (Right side)
- **Icon size**: 16px (not 18px - reference looks slightly smaller)
- **Padding**: 8px each button
- **Gap**: 4px between buttons
- **Color**: `#616061`
- **Hover**: bg `#f8f8f8`, rounded 4px
- **Order**: Users, Member count, Phone, Pin, Search, More (3 dots), X

#### Member Count
- **Text**: 13px, `#616061`
- **Format**: "8,140" with comma

#### Tabs Row
- **Padding**: 8px 16px 0
- **Tabs**: Messages, Pins, Files, More
- **Font**: 13px, medium (500)
- **Padding**: 8px 12px
- **Active**: `#1d1c1d`, bg `#f8f8f8`, rounded-t 6px
- **Inactive**: `#616061`, hover bg `#f8f8f8`

### Message Feed

#### Container
- **Padding**: 20px (reference looks like 16-20px)
- **Background**: `#ffffff`

#### Message Item
- **Margin-bottom**: 12px (between messages)
- **Avatar**: 36×36px, rounded 4px (square with slight radius)
- **Gap**: 12px between avatar and content

#### Message Header
- **Name**: 15px, bold (700), `#1d1c1d`
- **Timestamp**: 12px, `#616061`, margin-left 8px

#### Message Body
- **Font-size**: 15px
- **Line-height**: 1.46668
- **Color**: `#1d1c1d`

#### Slackbot Block Messages
- **Container**: Inline with message, no extra border/bg (appears as part of message)
- **Avatar**: "S" letter in purple square
- **Blocks**: Rendered inline with proper spacing

#### Date Separator
- **Lines**: 1px solid `#e8e8e8`
- **Text**: "Today", 13px, medium, `#616061`
- **Padding**: 12px 0
- **Gap**: 12px between line and text

### Message Input

#### Container
- **Padding**: 16px
- **Border-top**: 1px solid `#e8e8e8`

#### Formatting Toolbar
- **Icons**: 14px
- **Padding**: 6px each
- **Gap**: 2px
- **Color**: `#616061`
- **Hover**: bg `#f8f8f8`, rounded 4px

#### Input Field
- **Background**: `#f8f8f8`
- **Border**: 1px solid `#e8e8e8`
- **Border-radius**: 8px
- **Padding**: 10px 12px
- **Placeholder**: "Message #channel-name", 15px, `#616061`

#### Action Row (inside input)
- **Icons**: 16px
- **Gap**: 4px
- **Color**: `#616061`, Send icon `#1264a3`
- **Padding**: 6px each

---

## SLACKBOT PANEL (RIGHT)

### Dimensions
- **Default width**: ~380px (25-30% of viewport)
- **Min width**: 300px
- **Max width**: 480px
- **Background**: `#ffffff`
- **Border-left**: 1px solid `#e8e8e8`

### Header

#### Container
- **Padding**: 12px 16px
- **Border-bottom**: 1px solid `#e8e8e8`

#### Logo + Title
- **Logo size**: 24×24px
- **Gap**: 8px
- **Title**: "Slackbot", 15px, semibold (600), `#1d1c1d`

#### Action Icons (Star, Pencil, X, Maximize, Minimize)
- **Icon size**: 16px
- **Padding**: 6px each
- **Gap**: 2px
- **Color**: `#616061`
- **Hover**: bg `#f8f8f8`, rounded 4px

### Tabs

#### Container
- **Border-bottom**: 1px solid `#e8e8e8`

#### Tab
- **Padding**: 10px 16px
- **Font**: 13px, medium (500)
- **Active**: text `#1264a3`, border-bottom 2px solid `#1264a3`
- **Inactive**: text `#616061`, hover text `#1d1c1d`

#### Plus Tab
- **Icon**: 14px
- **Padding**: 10px 8px

### Welcome State

#### Mascot
- **Size**: 120×120px (larger than current 128×128)
- **Background**: Light circle or none
- **Illustration**: Colorful robot with Salesforce cap (pink/yellow/blue/teal)
- **Current**: Magenta # in light purple circle
- **Fix**: Need mascot SVG or PNG

#### Greeting
- **Text**: "Good morning, Prantik!"
- **Font**: 18px, bold (700), `#1d1c1d`
- **Margin-bottom**: 8px

#### Tagline
- **Text**: "The day loads, one unread message at a time."
- **Font**: 15px, regular, `#616061`
- **Margin-bottom**: 24px

#### Action Buttons (Discover, Create, Find, Brainstorm)
- **Shape**: Rounded rectangle, NOT pill
- **Border-radius**: 6px (not 9999px)
- **Background**: `#f0f0f0` or `#ebebeb` (light grey)
- **Border**: None or 1px solid `#d1d1d1` (very subtle)
- **Padding**: 10px 16px
- **Gap**: 8px between buttons
- **Flex-wrap**: Yes
- **Icon size**: 16px
- **Icon color**: `#616061`
- **Text**: 14px, medium (500), `#1d1c1d`
- **Gap between icon and text**: 8px
- **Hover**: bg `#e5e5e5`

---

## BLOCK KIT MESSAGES (IN CHANNEL)

### Reference: "Deal at risk: Global Industries"

#### Container
- **Background**: None or very subtle (inline with message)
- **Border**: 1px solid `#e8e8e8` (light border around block, not the whole message)
- **Border-radius**: 8px
- **Padding**: 12px 16px
- **Margin-top**: 4px (below message header)

#### Header Block
- **Text**: 15px, bold (700), `#1d1c1d`
- **Margin-bottom**: 8px

#### Section Fields (2-column)
- **Grid**: 2 columns
- **Gap**: 16px horizontal, 4px vertical
- **Label**: bold text in markdown (*Amount:*)
- **Value**: regular text below label
- **Font**: 15px
- **Line-height**: 1.46668

#### Section Text
- **Font**: 15px, `#1d1c1d`
- **Line-height**: 1.46668
- **Margin**: 8px 0

#### Action Buttons
- **Primary (Review)**: bg `#2eb886`, text white, padding 8px 16px, rounded 4px, 14px medium
- **Secondary (Dismiss)**: bg white, border 1px `#e8e8e8`, text `#1d1c1d`, padding 8px 16px
- **Gap**: 8px
- **Margin-top**: 12px

---

## SPECIFIC MEASUREMENTS FROM REFERENCE

### Left Sidebar
- Icon bar width: **60px**
- Activity sidebar width: **260px**
- Icon size: **20px**
- Icon button padding: **10px vertical** (looks tighter than our 2.5 rem padding)

### Channel Header
- Height: **49px**
- Icon size: **16px** (not 18px)
- Icon button padding: **8px** (not p-2 which is 8px - correct)
- Member count size: **13px**, not just "8" but formatted with comma if large

### Message Feed
- Message avatar: **36×36px**, border-radius **4-6px** (slightly rounded square, not circle)
- Message gap: **12px** between messages (vertical)
- Avatar-to-content gap: **12px**
- Date separator padding: **12px 0**

### Slackbot Welcome
- Mascot size: **100-120px** (larger than ours)
- Greeting font: **18px bold**
- Tagline font: **15px regular**
- Button padding: **10px 16px** (not 2.5 which is 10px vertical - close)
- Button gap: **8px**
- Button radius: **6px** (not full pill)
- Button background: **#efefef** or **#f0f0f0**

### Block Kit Cards
- Border: **1px solid #e8e8e8**
- Border-radius: **8px**
- Padding: **12px 16px**
- Header margin-bottom: **8px**
- Field grid gap: **16px horizontal, 4px vertical**
- Button margin-top: **12px**

---

## COLOR CORRECTIONS

| Element | Reference | Current | Fix |
|---------|-----------|---------|-----|
| Sidebar | `#1a1d21` (dark) or `#4a154b` (purple) | `#4a154b` | Keep or use dark grey for true Slack |
| Notification badge | `#e01e5a` or `#d92d20` (red) | N/A | Add red badges |
| Action button bg | `#efefef` / `#f0f0f0` | Border only | Add grey bg |
| Avatar (Activity) | Various | `#611f69` | Use varied colors per user |

---

## IMPLEMENTATION PRIORITIES

1. **Mascot** - Most visually obvious difference
2. **Action buttons** - Shape (rounded-md vs pill) and background (grey vs white)
3. **Notification badges** - Red circles on nav items
4. **Avatar shape** - 4-6px rounded square vs full circle
5. **Discover icon** - Star vs Sparkles
6. **Density** - Reduce padding to match tighter layout
7. **Block Kit borders** - Ensure cards have subtle border/bg
8. **Member count** - Format with comma (8,140 vs 8)

---

## NEXT STEPS

1. Create/add mascot illustration (SVG or PNG)
2. Update button styles (rounded-md, grey bg)
3. Add notification badges
4. Fix avatar border-radius
5. Update Discover icon
6. Reduce padding throughout
7. Refine BlockKitRenderer styling
8. Test and verify
