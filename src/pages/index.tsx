import React, { useMemo, useCallback, useEffect } from 'react';

import styled from 'styled-components';

import Coverflow from '../components/Coverflow';
import Image from '../components/Image';
import Layout from '../components/Layout';
import Link from '../components/Link';
import SEO from '../components/SEO';
import dataJson from '../constants/data.json';

const INDEX = 10;

interface Props {
  pageContext?: {
    country?: string,
    hasLP?: string,
    hasCD?: string,
  }
}

const MainPage: React.FC<Props> = ({ pageContext: { country, hasLP, hasCD } = {} }) => {
  const query = useMemo(() => ({ country, hasLP, hasCD }), [country, hasLP, hasCD]);
  const data = useMemo(() => dataJson
    .filter(row => Object.entries(query).every(([key, value]) => value !== undefined ? (
      `${row[key as keyof typeof row]}` === value
    ) : true))
  , [query]);

  const randoms = useMemo<number[]>(() => Array.from(Array(Math.min(data.length, INDEX))).reduce((arr, _, i) => {
    while (true) {
      const num = Math.floor(Math.random() * data.length);
      if (!arr.includes(num)) {
        arr[i] = num;
        return arr;
      }
    }
  }, []), [data]);

  const Cards = useMemo(() => data.map(({ artist, album, id }) => (
    <Card key={`Home-Card-${id}`}>
      <Link to={`/view/${artist}-${album}`}>
        <CardImage>
          <Image src={`music/${id}/0.jpg`} />
        </CardImage>
        <CardText>
          {artist}
        </CardText>
        <CardText>
          {album}
        </CardText>
      </Link>
    </Card>
  )), [data])

  return (
    <Layout>
      <SEO title='Home' />
      {data.length === dataJson.length && (
        <Coverflow
          displayQuantityOfSide={2}
          active={5}
          navigation={false}
          enableScroll={false}
          enableHeading={false}
        >
          {randoms.map((num) => (
            <Image
              key={`Home-Coverflow-${num}`}
              data-to={`/view/${data[num].artist}-${data[num].album}`}
              src={`music/${data[num].id}/0.jpg`}
            />
          ))}
        </Coverflow>
      )}
      <CardWrap>
        {Cards}
      </CardWrap>
    </Layout>
  );
};

const Card = styled.div`
  display: inline-block;
  vertical-align: top;
  margin: 10px 20px;

  @media only screen and (max-width: 600px) {
    width: 100%;
    margin: 0;
    margin-bottom: 60px;
  }
  @media only screen and (min-width: 600px) {
    width: 40%;
  }
  @media only screen and (min-width: 1200px) {
    width: 30%;
  }

  @media only screen and (min-width: 1600px) {
    width: 20%;
  }

  text-align: center;
`;

const CardImage = styled.div`
  width: 100%;
  position: relative;
  padding-top: 100%;
  border: 2px solid black;
  margin-bottom: 8px;
  @media only screen and (max-width: 600px) {
    border: none;
  }
  > div {
    position: absolute !important;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const CardWrap = styled.div`
  text-align: center;
  margin-top: 40px;
  @media only screen and (max-width: 600px) {
    margin-top: 0px;
  }
`;

const CardText = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
  color: #888;
  overflow-x: hidden;
`;

export default MainPage;
