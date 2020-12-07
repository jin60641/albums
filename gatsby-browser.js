/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

// You can delete this file if you're not using it


const removeTrailingSlash = (url) => url.replace('/\/$/', '');

exports.onRouteUpdate = () => {
  window.locations = window.locations || [document.referrer];
  const href = removeTrailingSlash(window.location.href);
  const before = removeTrailingSlash(window.locations[locations.length - 1]);
  if (before !== href) {
    window.locations.push(href);
  }
  window.previousPath = (window.locations[locations.length - 2] || '').replace(window.location.origin, '');
}
