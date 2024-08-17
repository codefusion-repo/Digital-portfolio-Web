import Layout from "hocs/layouts/Layout";
import logo from "assets/img/sampleBusinessImage.jpeg";
import Typewriter from "components/home/Typewriter";
import React from "react";
import { useMobile } from "context/mobile/mobileContext";

function Home() {
  const { device } = useMobile();

  return (
    <Layout>
      <Typewriter />

      <section
        className={`flex ${
          device > 2 ? "" : "navbar-m-s"
        } a-center wrap box-xxl four-bg`}
        id="home"
      >
        <div
          className={`flex column ${
            device > 2 ? "box-l" : "box-xxl"
          } a-start j-center gap-xs third-color padding-s`}
        >
          <h2>Hello & Welcome</h2>
          <div className="flex gap-xxs">
            <h2>We're</h2>
            <h2 className="second-color">Example name</h2>
          </div>

          <div className="flex gap-s">
            <h1>We create</h1>
            <h1 className="multiple-text second-color"></h1>
          </div>

          <p className="third-color">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            mollis faucibus commodo. Morbi magna mi, mollis vel aliquet ut,
            sagittis eget massa. Vestibulum mi nunc, eleifend ac justo quis,
            posuere tristique arcu. Proin suscipit volutpat.
          </p>

          <div className="flex gap-l box-xxl j-end padding-s">
            <a className="btn-page" target="_blank" href="https://facebook.com">
              <h3>
                <i className="bx bxl-facebook"></i>
              </h3>
            </a>
            <a className="btn-page" target="_blank" href="https://twitter.com">
              <h3>
                <i className="bx bxl-twitter"></i>
              </h3>
            </a>
            <a
              className="btn-page"
              target="_blank"
              href="https://instagram.com"
            >
              <h3>
                <i className="bx bxl-instagram-alt"></i>
              </h3>
            </a>
          </div>

          <a className="btn-middle" href="/portfolio">
            <h3>Portfolio</h3>
          </a>
        </div>

        <div
          className={`flex ${
            device > 2 ? "box-s" : "box-xxl"
          } f-height-xxl j-center a-center third-border border-radius-xs hidden home-img base-bg`}
        >
          <img className="fit-cover" src={logo} alt="logo" />
        </div>
      </section>
    </Layout>
  );
}
export default Home;
