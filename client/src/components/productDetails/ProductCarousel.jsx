import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import { localUrl } from "../../config.json";

/**
 * Component - ProductCarousel
 * @component
 * @param {Object} props - Containes product
 */
function ProductCarousel(props) {
  const { product } = props;
  const [Images, setImages] = useState([]);

  /**
   * const {product} - Object with single product details
   * On page load create images array
   */
  useEffect(() => {
    // If there's 1 or more image go in
    if (product.images && product.images.length > 0) {
      let images = [];
      // Create array of image Objects
      product.images.map((item) => {
        let url = localUrl;
        images.push({
          original: `${url}/${item}`,
          thumbnail: `${url}/${item}`,
        });
      });

      setImages(images);
    }
  }, [product]);

  return (
    <div>
      <ImageGallery items={Images} />
    </div>
  );
}

export default ProductCarousel;
