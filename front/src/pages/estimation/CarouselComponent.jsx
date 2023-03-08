import React from 'react'
import styled from 'styled-components'
import Carousel from 'react-grid-carousel'
import products from './mockProductList.json'

const Body = styled.div`
  background: #f3f3f3;
  position: relative;
  top: 0;
  left: 0;
  min-height: 70%;
  width: 100%;
`

const CarouselContainer = styled.div`
  padding: 20px 0;
`

const Row = styled.div`
  max-width: 1000px;
  margin: 10px auto;
  border-radius: 8px;
  background: #fff;

  @media screen and (max-width: 767px) {
    margin: 10px;
  }
`

const RowHead = styled.div`
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
`

const Card = styled.div`
  position: relative;

  img {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }

  span:first-of-type {
    color: red;
    font-size: 14px;
    font-weight: bold;
  }

  span:last-of-type {
    color: gray;
    font-size: 12px;
    margin-left: 10px;
  }

  @media screen and (max-width: 767px) {
    background: #f3f3f3;
    border: 1px solid #f3f3f3;
  }
`

const Title = styled.div`
  font-size: 14px;
  line-height: 14px;
  height: 32px;
  overflow: hidden;
  margin-bottom: 5px;
`

const Mask = styled.div`
  opacity: 0;
  height: 50vh;
  width: 70vw;
  cursor: pointer;
  background: #0000000a;
  position: absolute;
  border-radius: 8px;


  &:hover {
    opacity: 1;
  }
`




const CarouselComponent = (props) => {
  return (
    <Body>

      <Row>
        <RowHead>Appartement similaire</RowHead>
        <CarouselContainer>
          <Carousel cols={5} showDots loop>
            {props.data.map((val, i) => (
            
              <Carousel.Item key={i}>
                <a href={val.link}>
                <Card>
                  <Carousel cols={1} autoplay={2000} loop >
                   {
                      val.image.map((elt, j) => {
                        return (
                          <Carousel.Item key={j}>
                        <img alt="apart img" src={elt} />
                        </Carousel.Item>
                        )
                      })
                    }

                  </Carousel>


                  <div>
                    <Title>{val.title}</Title>
                    <span>{val.price}</span>
                    <br></br>
                    <span>{val.bedroom}</span>
                        <br></br>
                    <span>{val.bathrooms}</span>
                        <br></br>
                    <span>price : {val.area}</span>
                  </div>
                  <Mask />
                </Card>
                  </a>
              </Carousel.Item>
            
            ))}
          </Carousel>
        </CarouselContainer>
      </Row>

    </Body>
  )
}

export default CarouselComponent
