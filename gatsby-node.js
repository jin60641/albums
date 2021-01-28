/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

const path = require('path')
const qs = require('qs');
const { slash } = require('gatsby-core-utils')

const data = require('./src/constants/data.json');

const filter = Object.entries({
  hasLP: ['TRUE', 'FALSE', ''],
  hasCD: ['TRUE', 'FALSE', ''],
  country: ['ko', 'jp', ''],
});

const recursive = (obj = {}, index = 0) => {
  if (index === filter.length) {
    return [obj];
  }
  const [key, values] = filter[index];
  return values.reduce((arr, value) => arr.concat(recursive(value ? { ...obj, [key]: value } : obj, index + 1)), []);
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const viewTemplate = path.resolve('./src/templates/View.tsx');
  
  data.forEach(({
    artist,
    album,
    photoCount,
  }, rowId) => {
    createPage({
      path: `/view/${artist}-${album}`,
      component: slash(viewTemplate),
      context: {
        artist,
        album,
        photoCount,
        rowId,
      }
    })
  })
  const mainTemplate = path.resolve('./src/pages/index.tsx');
  recursive().forEach(query => {
    createPage({
      path: `/main/${qs.stringify(query)}`,
      component: slash(mainTemplate),
      context: query,
    })
  });
}
