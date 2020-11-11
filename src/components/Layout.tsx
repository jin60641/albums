/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from 'react';

import { graphql, useStaticQuery } from 'gatsby';
import PropTypes from 'prop-types';

import './layout.css';

const Layout: React.FC = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <main>{children}</main>
  );
};

Layout.propTypes = { children: PropTypes.node.isRequired };

export default Layout;
