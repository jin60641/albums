/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

// You can delete this file if you're not using it

exports.onRouteUpdate = () => {
  window.locations = window.locations || [document.referrer];
  if (window.locations[locations.length - 1] !== window.location.href) {
    window.locations.push(window.location.href);
  }
  window.previousPath = (window.locations[locations.length - 2] || '').replace(window.location.origin, '');
}
