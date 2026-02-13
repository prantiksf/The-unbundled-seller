/**
 * Figma Design Components - Slack Desktop App
 * 
 * This index file exports all the Figma-generated components for the Slack Desktop App design.
 * 
 * Main Node: 803:59733 "Slack Desktop App"
 * 
 * Components:
 * - NavBar (803:59756): Left navigation bar with workspace switcher, tabs (Home, DMs, Activity, Agents, More), and profile
 * - Sidebar (803:59757): Channel and DM sidebar with workspace header, channels list, DMs, and apps
 * - Conversation (803:59796): Main conversation view with header, messages, and composer
 * - SecondaryView (803:59809): Right panel showing Slackbot interface
 * 
 * Note: These components use Tailwind CSS classes. Make sure Tailwind is configured in your project.
 * Asset paths are relative to /public/figma/
 */

export { default as NavBar } from './NavBar';
export { default as Sidebar } from './Sidebar';
export { default as Conversation } from './Conversation';
export { default as SecondaryView } from './SecondaryView';

// Export all components as a single object for convenience
export const SlackDesktopComponents = {
  NavBar: require('./NavBar').default,
  Sidebar: require('./Sidebar').default,
  Conversation: require('./Conversation').default,
  SecondaryView: require('./SecondaryView').default,
};
