import React, { useEffect, useState } from "react";
import "../css/HomePage.css";
import http from "../services/httpService";
import { Col, Row, Card } from "antd";
import Meta from "antd/lib/card/Meta";
import { Link } from "react-router-dom";
import { Typography, makeStyles } from "@material-ui/core";
import ImageSlider from "./utils/ImageSlider";
import { useToasts } from "react-toast-notifications";
import PageHeader from "./utils/PageHeader";
import PopularBrands from "./HomePageDetail/PopularBrands";
import { localUrl, apiUrl } from "../config.json";

const useStyles = makeStyles((them) => ({
  topImage: {
    backgroundImage: `url("${localUrl}/images/homepagestrip.jpg")`,
  },
}));
/**
 * Component - Home page
 * @component
 */
function Home() {
  const styles = useStyles();
  const { addToast } = useToasts();
  const [MostViewedProducts, setMostViewedProducts] = useState([]);

  /**
   * On page load send request to server to get most viewed products list
   */
  useEffect(() => {
    const limit = 8;
    http.post(`${apiUrl}/products/getMostViews`, { limit }).then((response) => {
      if (response.data.success) {
        setMostViewedProducts(response.data.products);
      } else {
        addToast("Faild to fetch products", {
          appearance: "error",
        });
      }
    });
  }, []);

  // Render products cards by mapping MostViewedProducts {Array}
  const renderCards = MostViewedProducts.map((prod, index) => {
    return (
      <Col key={index} xs={12} md={8} lg={6}>
        <Card
          style={{
            backgroundColor: "#fafafa",
            overflow: "hidden",
          }}
          bordered={true}
          hoverable={true}
          cover={
            <a href={`/products/${prod._id}`}>
              <ImageSlider images={prod.images} />{" "}
            </a>
          }
        >
          <div className="card-title">{prod.title} </div>
          <Meta description={`$${prod.price}`} />
        </Card>
      </Col>
    );
  });

  return (
    <div>
      <div className="d-sm-block d-md-none">
        <PageHeader>Home</PageHeader>
      </div>

      <div
        className={`home-page-header d-none d-sm-none d-md-block ${styles.topImage}`}
      >
        {/* stripe image */}
      </div>
      <div className="container">
        <PopularBrands />

        <div className="row mt-4">
          <div className="col-8">
            <h2 className="mb-0 row-title">Most Popular</h2>
          </div>
          <div className="col-4 d-flex align-items-end justify-content-end">
            <Typography component="h5">
              <Link className="see-all text-success" to="/products">
                See All
              </Link>
            </Typography>
          </div>
        </div>
        <div className="mt-2">
          <Row gutter={[30, 16]}>{renderCards}</Row>
        </div>
      </div>
    </div>
  );
}

export default Home;
