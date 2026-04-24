// Set to true to enable the "lights out" dialog and force dark mode
// Also activates via ?darktest=1 URL parameter for preview
export const LIGHTS_OUT = false || new URLSearchParams(window.location.search).has("darktest") || window.location.hash === "#darktest";

// Set to true to show the pre-event landing page instead of the leaderboard
// Change to false and push when the event starts
export const PRE_EVENT = true; // bypassed by ?mode=live or date check
