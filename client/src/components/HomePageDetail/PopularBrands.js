import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { localUrl } from "../../config.json";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((them) => ({
  jordan: {
    backgroundImage: `url("${localUrl}/images/JumpMan.png")`,
  },
  nike: {
    backgroundImage: `url("${localUrl}/images/nikeSwoosh.png")`,
  },
  yeezy: {
    backgroundImage: `url("${localUrl}/images/yeezyLogo.png")`,
  },
  adidas: {
    backgroundImage: `url("${localUrl}/images/adidasLogo.png")`,
  },
}));

/**
 * Move to dynamic url
 * @param {String} brandName - Brand name
 */
const changeLocation = (brandName) => {
  return (window.location = `/brands/${brandName}`);
};

function PopularBrands() {
  const styles = useStyles();

  return (
    <div>
      <div className="row mt-4">
        <div className="col-8">
          <h2 className="mb-0 row-title">Popular Brands</h2>
        </div>
        <div className="col-4 d-flex align-items-end justify-content-end">
          <Typography component="h5">
            <Link className="see-all text-success" to="/products">
              See All
            </Link>
          </Typography>
        </div>
      </div>
      <div className="row scroll" style={{ overflowX: "auto" }}>
        <div className="col-12 d-flex justify-content-between">
          <div className="p-2 brands-container ">
            <Link to="#" onClick={() => changeLocation("jordan")}>
              <img
                src={`${localUrl}/images/000-air-jordan.jpg`}
                alt=""
                className="brands"
              />
              <div className={`${styles.jordan} side-image-container`} />
            </Link>
          </div>
          <div className="p-2 brands-container">
            <Link to="#" onClick={() => changeLocation("nike")}>
              <img
                width="250px"
                src={`${localUrl}/images/001-nike.jpg`}
                alt=""
                className="brands"
              />
              <div className={`${styles.nike} side-image-container `} />
            </Link>
          </div>
          <div className="p-2 brands-container ">
            <Link to="#" onClick={() => changeLocation("yeezy")}>
              <img
                width="250px"
                src={`${localUrl}/images/002-yeezy.jpg`}
                alt=""
                className="brands"
              />
              <div className={`${styles.yeezy} side-image-container `} />
            </Link>
          </div>
          <div className="p-2 brands-container ">
            <Link to="#" onClick={() => changeLocation("adidas")}>
              <img
                width="250px"
                src={`${localUrl}/images/003-adidas.jpg`}
                alt=""
                className="brands"
              />
              <div className={`${styles.adidas} side-image-container `} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopularBrands;
