import React from 'react';
import styles from './gallery.module.css';

const Gallery = () => {

  let data = [
    {
      id: 1,
      imgSrc: '/portfolio/apartmentSunset.png',
    },
    {
      id: 2,
      imgSrc: '/portfolio/bagel.png',
    },
    {
      id: 3,
      imgSrc: '/portfolio/balcony.png',
    },
    {
      id: 4,
      imgSrc: '/portfolio/card.png',
    },
    {
      id: 5,
      imgSrc: '/portfolio/glass.png',
    },
    {
      id: 6,
      imgSrc: '/portfolio/lampVP2.png',
    },
    {
      id: 7,
      imgSrc: '/portfolio/pool.png',
    },
    {
      id: 8,
      imgSrc: '/portfolio/pumpkin.png',
    },
    {
      id: 9,
      imgSrc: '/portfolio/star.png',
    },
  ]

  return (
      <>
        <div className={styles.gallery}>
          {data.map((item, index) => {
            return (
              <div className={styles.img} key={index}>
                <img src={item.imgSrc} style={{ width: '100%' }} />
              </div>
            )
          })}
        </div>
      </>
  )
}

export default Gallery;