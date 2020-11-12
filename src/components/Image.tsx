import React from 'react';

import { graphql, StaticQuery } from 'gatsby';
import Img from 'gatsby-image';

interface Props {
  src: string;
}

const Image: React.FC<Props> = ({ src }) => (
  <StaticQuery
    query={graphql`
      query {
        images: allFile(filter: { relativePath: { regex: "/.*\/0.jpg$/" } } ) {
          edges {
            node {
              relativePath
              name
              childImageSharp {
                fluid(maxWidth: 600) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    `}
    render={(data) => {
      const image = data.images.edges.find((n: any) => src === n.node.relativePath);
      if (!image) {
        return null;
      }

      // const imageSizes = image.node.childImageSharp.sizes; sizes={imageSizes}
      return <Img fluid={image.node.childImageSharp.fluid} />;
    }}
  />
);

export default Image;
