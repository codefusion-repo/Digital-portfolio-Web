import axios from "axios";
import { useMobile } from "context/mobile/mobileContext";
import Layout from "hocs/layouts/Layout";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch } from "react-redux";
import { ADD_MSJ_MODAL } from "redux/actions/modal/types";

function Contact() {
  const { device } = useMobile();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    complete_name: "",
    email: "",
    mobile_number: "",
    subject: "",
    message: "",
  });

  const { complete_name, email, mobile_number, subject, message } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    const sendEmail = async () => {
      const formData = new FormData();
      formData.append("complete_name", complete_name);
      formData.append("email", email);
      formData.append("mobile_number", mobile_number);
      formData.append("subject", subject);
      formData.append("message", message);

      const config = {
        Accept: "application/json",
      };

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/postman/send_contact_email`,
          formData,
          config
        );

        if (res.status === 200) {
          dispatch({
            type: ADD_MSJ_MODAL,
            payload: {
              showModal: true,
              message:
                "Gracias por contactarnos, responderemos en breve. Enviamos una copia de la solicitud a tu correo electrónico.",
            },
          });
        } else {
          alert("Error al enviar el correo electrónico.");
        }
      } catch (err) {
        alert("Error al enviar el correo electrónico.");
      }
    };

    sendEmail();
  };

  return (
    <Layout>
      <Helmet>
        <title>Name | Contacto</title>
      </Helmet>
      <section
        className="flex column a-center j-center four-bg third-color"
        id="contact"
      >
        <div className="flex gap-s">
          <h1>Contact</h1>
          <h1 className="second-color">Us</h1>
        </div>

        <form
          className={`flex ${
            device > 2 ? "box-ms" : "box-xxl-m"
          } wrap a-center j-center`}
          onSubmit={(e) => onSubmit(e)}
          encType="multipart/form-data"
        >
          <div className="flex box-xxl j-center padding-s gap-s">
            <input
              onChange={(e) => onChange(e)}
              className="input-large"
              type="text"
              name="complete_name"
              id="complete_name"
              value={complete_name}
              placeholder="Full Name"
              required
            />
            <input
              onChange={(e) => onChange(e)}
              className="input-large"
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="Email Address"
              required
            />
          </div>
          <div className="flex box-xxl j-center padding-s gap-s">
            <input
              onChange={(e) => onChange(e)}
              className="input-large"
              type="number"
              name="mobile_number"
              id="mobile_number"
              value={mobile_number}
              placeholder="Mobile Number [Optional]"
            />
            <input
              onChange={(e) => onChange(e)}
              className="input-large"
              type="text"
              name="subject"
              id="subject"
              value={subject}
              placeholder="Subject"
              required
            />
          </div>
          <div className="flex box-xxl a-center j-center padding-s gap-s">
            <textarea
              onChange={(e) => onChange(e)}
              className="textarea-large padding-xs"
              name="message"
              id="message"
              cols="30"
              rows="10"
              placeholder="Your Message"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn-middle margin-t-s">
            <h3>Send</h3>
          </button>
        </form>
      </section>
    </Layout>
  );
}
export default Contact;
