import React, { useMemo } from 'react';

import styled from '@emotion/styled';

import Coverflow from '../components/Coverflow';
import Image from '../components/Image';
import Layout from '../components/Layout';
import Link from '../components/Link';
import SEO from '../components/SEO';
import dataJson from '../constants/data.json';
import { Data } from '../constants/types';

interface PageContext {
  data: Data[],
}

interface Props {
  pageContext: PageContext,
}

const getDefaultRandoms = () => {
  const len = Math.min(dataJson.length, 10);
  const arr: number[] = [];
  while (arr.length < len) {
    const num = Math.floor(Math.random() * dataJson.length);
    if (!arr.includes(num)) {
      arr.push(num);
    }
  }
  return arr;
};

const randoms = getDefaultRandoms();

const MainPage: React.FC<Props> = ({ pageContext: { data = dataJson as Data[] } }) => {
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
  )), [data]);

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
