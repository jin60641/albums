/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it
//
//
const path = require(`path`)
const { slash } = require(`gatsby-core-utils`)

const data = require('./src/constants/data.json');
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  // query content for WordPress posts
  const template = path.resolve(`./src/templates/View.tsx`)
  
  data.forEach(({
    artist,
    album,
    photoCount,
  }, rowId) => {
    createPage({
      // will be the url for the page
      path: "/view/" + `${artist}-${album}`,
      // specify the component template of your choice
      component: slash(template),
      // In the ^template's GraphQL query, 'id' will be available
      // as a GraphQL variable to query for this posts's data.
      context: {
        artist,
        album,
        photoCount,
        rowId,
      }
    })
  })
}
