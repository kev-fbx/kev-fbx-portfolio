"use client";

import React, { useState } from 'react';
import styles from './gallery.module.css';
import Image from 'next/image';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const handleImageClick = (imgSrc: string): void => {
    const img = new window.Image();
    img.src = imgSrc;
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setSelectedImage(imgSrc);
      setIsPopupVisible(true);
    };
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedImage(null);
    setImageDimensions({ width: 0, height: 0 });
  };

  const data = [
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
    {
      id: 10,
      imgSrc: '/portfolio/pz1.png',
    },
    {
      id: 11,
      imgSrc: '/portfolio/night.jpg',
    },
  ]

  return (
      <>
        <div className={styles.gallery}>
          {data.map((item, index) => {
            return (
              <div className={styles.img} key={index} onClick={() => handleImageClick(item.imgSrc)}>
                <div className={styles.imgContainer}>
                  <Image src={item.imgSrc} alt={`Gallery item ${item.id}`} />
                </div>
              </div>
            )
          })}
        </div>

        {isPopupVisible && (
          <div className={styles.popup} onClick={closePopup}>
            <div
              className={styles.popupContent}
              style={{
                aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeButton} onClick={closePopup}>×</button>
              <Image src={selectedImage || ''} alt="Selected item" />
            </div>
          </div>
        )}
      </>
  )
}

export default Gallery;