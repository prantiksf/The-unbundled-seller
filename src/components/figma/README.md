# Figma Design Components - Slack Desktop App

This directory contains React components exported from the Figma design "Slack Desktop App" (Node ID: 803:59733).

## Components

### 1. **NavBar.tsx** (Node ID: 803:59756)
**Location:** `/src/components/figma/NavBar.tsx`

The left navigation bar component featuring:
- Workspace switcher with notification badges
- Navigation tabs:
  - Home (active state with notification)
  - DMs (with badge count)
  - Activity (with badge count)
  - Agents
  - More
- Action button at bottom
- Profile section with status indicator

**Key Features:**
- Workspace stacking visualization
- Tab hover tooltips
- Badge notifications
- Custom status emoji (🔮)

### 2. **Sidebar.tsx** (Node ID: 803:59757)
**Location:** `/src/components/figma/Sidebar.tsx`

The main sidebar component with:
- Workspace header (Acme Inc)
- Navigation sections:
  - Pages (Unreads, Threads, Drafts & sent)
  - Channels (q3-priorities, support, sales-support)
  - Direct messages (with user avatars)
  - Apps (Polly, Jira Plus, Google Drive, Google Calendar)

**Status:** Simplified implementation based on screenshot (full code generation blocked by asset overwriting restrictions)

### 3. **Conversation.tsx** (Node ID: 803:59796)
**Location:** `/src/components/figma/Conversation.tsx`

The main conversation view featuring:
- Channel header with:
  - Channel name (#sales-support)
  - Members count button
  - Huddles button with dropdown
  - More actions menu
- Subheader tabs (Messages, Canvas, Pins, More)
- Message list with:
  - User avatars
  - Message content
  - Timestamps
  - Reply indicators
  - @mentions highlighting
- Message composer with:
  - Rich text input
  - Formatting toolbar
  - Attachment options
  - Send button with dropdown

**Key Features:**
- Scrollable message area
- @Channel Expert mentions
- Reply threads
- Comprehensive composer toolbar

### 4. **SecondaryView.tsx** (Node ID: 803:59809)
**Location:** `/src/components/figma/SecondaryView.tsx`

The Slackbot interface panel with:
- Header with Slackbot branding and action buttons
- Messages/History tab navigation
- Welcome screen:
  - Slackbot avatar (colorful gradient)
  - Greeting message
  - Subtitle text
- Message composer with formatting options

**Status:** Simplified implementation based on screenshot (full code generation blocked by asset overwriting restrictions)

## Technical Details

### Styling
All components use **Tailwind CSS** classes for styling. The original Figma design tokens are preserved in the class names where possible.

### Assets
Image and SVG assets are referenced from `/public/figma/`. Asset paths in the components:
- PNG images: Avatar images, workspace logos
- SVG icons: Navigation icons, UI elements

### Typography
The design uses the **Lato** font family with these weights:
- Regular (400)
- Bold (700)
- Black (900)

Make sure to include Lato in your project:
```html
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet">
```

### Color Scheme
The design uses CSS custom properties for theming:
- `--dt_color-theme-base-imp`: Primary theme color (#eabdfb)
- `--dt_color-theme-content-imp`: Content color (#4a154b)
- `--dt_color-content-pry`: Primary content (#1d1c1d)
- `--dt_color-content-sec`: Secondary content (#454447)
- And more...

## Usage

### Import Individual Components
```typescript
import { NavBar, Sidebar, Conversation, SecondaryView } from '@/components/figma';

function SlackApp() {
  return (
    <div className="flex h-screen">
      <NavBar />
      <Sidebar />
      <Conversation />
      <SecondaryView />
    </div>
  );
}
```

### Import All Components
```typescript
import { SlackDesktopComponents } from '@/components/figma';

const { NavBar, Sidebar, Conversation, SecondaryView } = SlackDesktopComponents;
```

## Layout Structure

The recommended layout structure for the Slack Desktop App:

```
┌────────┬──────────────┬───────────────────┬──────────────┐
│        │              │                   │              │
│        │              │   Conversation    │  Secondary   │
│ NavBar │   Sidebar    │   (Main View)     │     View     │
│        │              │                   │  (Slackbot)  │
│  76px  │    230px     │      357px        │    353px     │
│        │              │                   │              │
└────────┴──────────────┴───────────────────┴──────────────┘
```

## Known Limitations

### Asset Overwriting Issue
During the export process, Figma's asset writing encountered restrictions for the Sidebar and SecondaryView components. As a result:

1. **Sidebar.tsx** and **SecondaryView.tsx** are simplified implementations based on screenshots
2. These components may need refinement for production use
3. Some SVG icons are referenced but may need to be created separately

To resolve this, you can:
- Update Figma settings to allow asset overwriting
- Re-run the Figma export with the `forceCode` parameter
- Manually extract missing assets from the Figma design

## Next Steps

1. **Add SVG Assets**: Create the referenced SVG files in `/public/figma/` for icons
2. **Configure Tailwind**: Ensure Tailwind CSS is properly configured with all necessary utilities
3. **Add Lato Font**: Include the Lato font family in your project
4. **Test Components**: Import and test each component in your application
5. **Refine Simplified Components**: Enhance Sidebar and SecondaryView components if needed
6. **Add Interactions**: Implement click handlers, state management, and interactive behaviors

## Support

For questions or issues related to these components, refer to:
- Figma design file: Node 803:59733 "Slack Desktop App"
- Generated on: February 13, 2026
- Export parameters:
  - Languages: TypeScript
  - Frameworks: React, Next.js
  - Artifact Type: Component within a web page/app screen
