"use client";

// pagination.tsx

//import "./pagination.css";
import { useEffect, useState } from "react";
import { MdOutlineArrowBack, MdOutlineArrowForward } from "react-icons/md";

export default function Pagination({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  data,
}) {
  const [active, setActive] = useState(1);
  const [count, setCount] = useState(data?.length ? data.length : 0);

  useEffect(() => {
    setActive(1);
    setCurrentPage(1);
    setCount(data?.length ? data.length : 0);
  }, [data]);

  const visitShopPage = (page) => {
    setCurrentPage(page);
    setActive(page);
  };

  const nextShopPage = () => {
    if (currentPage !== 0) {
      setCurrentPage(currentPage + 1);
      setActive(currentPage + 1);
    }
  };

  const previousShopPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      setActive(currentPage - 1);
    }
  };
  let shopNumbers = [];
  const getShopNumbers = () => {
    let pageNumber = 1;

    if (count < itemsPerPage) return;

    for (let i = 0; i < count; i += itemsPerPage) {
      const page = pageNumber;
      let content = null;

      if (active === page) {
        content = (
          <button key={i} className="btn-page btn-page-active">
            <h3 className="flex a-center j-center">{pageNumber}</h3>
          </button>
        );
      } else {
        content = (
          <button
            onClick={() => {
              visitShopPage(page);
            }}
            key={i}
            className="btn-page"
          >
            <h3 className="flex a-center j-center">{pageNumber}</h3>
          </button>
        );
      }

      shopNumbers.push(content);
      pageNumber++;
    }
    return shopNumbers;
  };
  return (
    <div className="flex relative f-height-s box-xxl gap-s a-center j-center t-center">
      {count > 1 ? (
        <>
          {currentPage !== 1 ? (
            <button
              onClick={() => {
                previousShopPage();
              }}
              className="btn-page"
            >
              <h3 className="flex a-center j-center">
                <MdOutlineArrowBack className="zoom-out-xxl" />
              </h3>
            </button>
          ) : (
            <></>
          )}
          {getShopNumbers()}
          {shopNumbers.length === 0 || currentPage === shopNumbers.length ? (
            <></>
          ) : (
            <button
              onClick={() => {
                nextShopPage();
              }}
              className="btn-page"
            >
              <h3 className="flex a-center j-center">
                <MdOutlineArrowForward className="zoom-out-xxl" />
              </h3>
            </button>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
