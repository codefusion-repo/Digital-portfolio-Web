import Layout from "hocs/layouts/Layout";
import logo from "assets/img/sampleBusinessImage.jpeg";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useMobile } from "context/mobile/mobileContext";

function About() {
  const { device } = useMobile();

  return (
    <Layout>
      <Helmet>
        <title>Name | About us</title>
      </Helmet>
      <section
        className={`flex ${
          device > 2 ? "wrap" : "wrap-reverse navbar-m-s"
        } a-center four-bg third-color`}
        id="about"
      >
        <div
          className={`flex ${
            device > 2 ? "box-s" : "box-xxl"
          } f-height-xxl j-center a-center third-border border-radius-xs hidden home-img base-bg`}
        >
          <img className="fit-cover" src={logo} alt="logo" />
        </div>

        <div
          className={`flex ${
            device > 2 ? "box-l" : "box-xxl"
          } column padding-s gap-xs`}
        >
          <div className="flex gap-s">
            <h1>About</h1>
            <h1 className="second-color">Us</h1>
          </div>
          <h2>Lorem ipsum dolor sit amet</h2>
          <h4>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </h4>
          {/*<Link className="btn">Read more</Link>*/}
        </div>
      </section>
    </Layout>
  );
}
export default About;
