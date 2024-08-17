import { useMobile } from "context/mobile/mobileContext";
import { connect } from "react-redux";

function Footer() {
  const { device } = useMobile();
  return (
    <footer className="flex box-xxl f-height-s base-border-t j-space a-center padding-m third-bg">
      <div>
        <h3>Copyright © 2023 - All right reserved by CodeFusion.cl.</h3>
      </div>
      <div className={`flex ${device > 2 ? "gap-m" : "gap-s"} j-end padding-s`}>
        <a className="btn-small" target="_blank" href="https://facebook.com">
          <h2>
            <i className="bx bxl-facebook"></i>
          </h2>
        </a>
        <a className="btn-small" target="_blank" href="https://twitter.com">
          <h2>
            <i className="bx bxl-twitter"></i>
          </h2>
        </a>
        <a className="btn-small" target="_blank" href="https://instagram.com">
          <h2>
            <i className="bx bxl-instagram-alt"></i>
          </h2>
        </a>
        <a className="btn-small" href="#">
          <h2>
            <i className="bx bx-up-arrow-alt"></i>
          </h2>
        </a>
      </div>
    </footer>
  );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Footer);
