import React from "react";
import { Carousel } from "antd";
import {localUrl} from "../../config.json"
function ImageSlider({ images }) {
  return (
    <div>
      <Carousel autoplay>
        {images.map((image, index) => (
          <div key={index}>
            <img
              style={{ width: "100%", maxHeight: "150px" }}
              src={`${localUrl}/${image}`}
              alt="productImage"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageSlider;
