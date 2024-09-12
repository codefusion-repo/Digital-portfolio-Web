import Layout from "hocs/layouts/Layout";
import React from "react";
import { Helmet } from "react-helmet-async";

function Services() {
  return (
    <Layout>
      <Helmet>
        <title>Name | Services</title>
      </Helmet>

      <section className="flex column box-xxl navbar-m-s four-bg" id="services">
        <div className="flex gap-s margin-b-m">
          <h1 className="third-color">Our</h1>
          <h1 className="second-color">services</h1>
        </div>

        <div className="flex box-xxl wrap j-center a-center gap-xl">
          <div className="flex column a-center j-center f-width-xxxxl f-height-xxl padding-m gap-xs border-xs third-bg border-radius-xs">
            <h1 className="second-color">
              <i className="bx bx-code-alt"></i>
            </h1>

            <h2>Example service</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum molestie laoreet eros, eget pharetra enim vestibulum
              non. Class aptent taciti sociosqu ad litora torquent per conubia
              nostra, per inceptos himenaeos. Pellentesque suscipit, justo ut
              feugiat tristique, nisi purus ultrices augue, at rhoncus elit urna
              vitae velit. Aliquam vitae ante convallis, consectetur diam vitae,
              egestas dolor. Nulla facilisi. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit.
            </p>
          </div>

          <div className="flex column a-center j-center f-width-xxxxl f-height-xxl padding-m gap-xs border-xs third-bg border-radius-xs">
            <h1 className="second-color">
              <i className="bx bx-code-alt"></i>
            </h1>
            <h2>Example service</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum molestie laoreet eros, eget pharetra enim vestibulum
              non. Class aptent taciti sociosqu ad litora torquent per conubia
              nostra, per inceptos himenaeos. Pellentesque suscipit, justo ut
              feugiat tristique, nisi purus ultrices augue, at rhoncus elit urna
              vitae velit. Aliquam vitae ante convallis, consectetur diam vitae,
              egestas dolor. Nulla facilisi. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit.
            </p>
          </div>

          <div className="flex column a-center j-center f-width-xxxxl f-height-xxl padding-m gap-xs border-xs third-bg border-radius-xs">
            <h1 className="second-color">
              <i className="bx bx-code-alt"></i>
            </h1>
            <h2>Example service</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum molestie laoreet eros, eget pharetra enim vestibulum
              non. Class aptent taciti sociosqu ad litora torquent per conubia
              nostra, per inceptos himenaeos. Pellentesque suscipit, justo ut
              feugiat tristique, nisi purus ultrices augue, at rhoncus elit urna
              vitae velit. Aliquam vitae ante convallis, consectetur diam vitae,
              egestas dolor. Nulla facilisi. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
export default Services;
