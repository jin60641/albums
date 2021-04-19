import React from 'react';

import { graphql, StaticQuery, useStaticQuery } from 'gatsby';
import { GatsbyImage as Img, getImage } from 'gatsby-plugin-image';

interface Props {
  src: string;
}

const query = graphql`
  query {
    images: allFile(filter: { relativePath: { regex: "/.*\/0.jpg$/" } } ) {
      edges {
        node {
          relativePath
          name
          childImageSharp {
            gatsbyImageData(
              placeholder: BLURRED
              layout: FULL_WIDTH
            )
          }
        }
      }
    }
  }
`;

const Image: React.FC<Props> = ({ src, ...props }) => {
  const data = useStaticQuery(query);
  const image = data.images.edges.find((n: any) => src === n.node.relativePath);
  const item = getImage(image.node);
  
  if (!item) {
    return null;
  }

  return (
      <Img
        image={item}
        alt='hello'
      />
    );
}

export default Image;
