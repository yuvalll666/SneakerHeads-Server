import React from "react";
import PageHeader from "./utils/PageHeader";
import "../css/About.css";

function About() {
  return (
    <div>
      <div className="d-sm-block d-md-block d-lg-none">
        <PageHeader>Who We Are ?</PageHeader>
      </div>
      <div className="page-header d-none d-sm-none d-md-none d-lg-block">
        <div className="container">
          <div className="row">
            <div className="col-6 text-container">
              <h2 className="page-header-title">
                THE STOCK MARKET FOR SNEACKERS
              </h2>
              <p>
                SneakerHeads is the world’s first stock market for sneakers.
                <br /> Here you can find your favorite sneaker from a wide
                variety of the most wanted brands. Retro Jordans, Nikes, Yeezys
                and more – now 100% authentic guaranteed.
              </p>
            </div>
            <div className="col-6 d-flex justify-content-center align-items-center">
              <div className="page-header-image">
                <img
                  width="100%"
                  src="/images/airForce1_white.png"
                  alt="air-force-1 image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row mt-4">
          <div className="col-12 text-center">
            <h1 className="display-4 pt-4">We Are SneakerHeads </h1>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <p className="main-para">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta cum
              odio, a numquam ab officia nesciunt. Eveniet voluptates nulla
              <br />
              accusantium beatae maiores nobis iusto, perspiciatis nemo
              cupiditate, aliquid porro, delectus perferendis corporis unde.
              Ipsum vel, delectus possimus id quas incidunt provident quod
              nostrum ad mollitia earum voluptas perferendis ullam consequatur
              <br />
              <br />
              amet dolore architecto asperiores quo fugit aliquam inventore
              reiciendis dolores! Beatae officia illo consectetur tempore
              voluptatem commodi pariatur fugiat corporis sunt rem quibusdam
              nihil molestiae, repellendus porro impedit exercitationem in
              tempora labore suscipit alias totam dolorum? Itaque quas repellat
              excepturi nam, temporibus iste laudantium harum ipsum assumenda
              vitae labore qui!
            </p>
          </div>
        </div>
      </div>

      <div className="bg-success mt-4 d-sm-block d-md-block d-lg-none">
        <div className="container">
          <div className="row ">
            <div className="col-12 d-flex flex-column justify-content-center align-items-center">
              <h2 className="text-center m-4 visit-us-title">Come Visit Us</h2>
              <p className="text-center visit-us-para">
                SneakerHeads physical shop is a one of a kind. We got the
                biggest collection, of your favorite brands, in the area and we
                are welcoming you to come and shop with our winning and joyfull
                staff.
                <br />
                <strong>
                  <i>Come and share your love for sneakers!</i>
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sec-section mt-4 d-none d-sm-none d-md-none d-lg-block">
        <div className="container">
          <div className="row mt sec-section-row shop-image">
            <div className="col-5 d-flex justify-content-center align-items-center">
              <div className="">
                <img
                  width="100%"
                  src="/images/pexels-rodnae-productions-5698853.jpg"
                  alt="air-force-1 image"
                />
              </div>
            </div>
            <div className="col-7 d-flex flex-column justify-content-center align-items-center">
              <h2 className="visit-us-title">Come Visit Us</h2>
              <p className="visit-us-para">
                SneakerHeads physical shop is a one of a kind. We got the
                biggest collection, of your favorite brands, in the area and we
                are welcoming you to come and shop with our winning and joyfull
                staff.
                <br />
                Come and share your love for sneakers!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
