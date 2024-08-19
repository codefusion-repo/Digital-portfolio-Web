import Pagination from "components/pagination/Pagination";
import { useMobile } from "context/mobile/mobileContext";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function PostBody({ posts }) {
  const { device } = useMobile();

  let params = useParams();
  const [currentPage, setCurrentPage] = useState(
    params.currentPage ? params.currentPage : 1
  );
  const itemsPerPage = 10;
  const [data, setData] = useState(posts);

  let startIndex = (currentPage - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;
  let currentItems = data?.slice(startIndex, endIndex);

  useEffect(() => {
    setData(posts);
  }, [posts]);

  return (
    <>
      <div className="flex wrap box-xxl j-center third-color gap-m">
        {posts && posts.length > 0 ? (
          <>
            {" "}
            {currentItems &&
              currentItems.map((post) => (
                <Link
                  to={`/blog/${post.slug}`}
                  key={post.id}
                  className={`flex wrap f-width-xxxxl relative ${
                    device > 1 ? "f-height-l" : "f-height-xxl"
                  } third-bg border-radius-xs hidden`}
                >
                  <div
                    className={`${
                      device > 1 ? "box-s" : "box-xxl f-height-ml"
                    } hidden`}
                  >
                    <img
                      className="fit-cover zoom-in-xs"
                      src={`${post.thumbnail}`}
                      alt="post img"
                    />
                  </div>

                  <div
                    className={`${device > 1 ? "box-l" : "box-xxl"} padding-ms`}
                  >
                    <h2 className="second-color">
                      {post.title.length > 150
                        ? post.title.slice(0, 149)
                        : post.title}
                    </h2>
                    <Link
                      className="btn-small a-center j-start"
                      to={`/category/${post.category.slug}`}
                    >
                      <h4>{post.category.name}</h4>
                    </Link>
                    <h4 className="second-color">
                      {moment(post.published).format("LL")}
                    </h4>
                    <h4 className="second-color">{post.time_read} min read</h4>
                    <h5>
                      {post.description.length > 200
                        ? post.description.slice(0, 199) + "..."
                        : post.description}
                    </h5>
                  </div>

                  <div className="absolute f-right f-bottom margin-r-xs margin-b-xxs">
                    <Link className="btn-small" to={`/blog/${post.slug}`}>
                      <h2>
                        <i className="bx bx-link-external"></i>
                      </h2>
                    </Link>
                  </div>
                </Link>
              ))}
          </>
        ) : (
          <h2 className="box-xxl padding-l-xs">No posts found.</h2>
        )}

        {/*<SmallSetPagination list_page={list_page} list={posts} count={count} />*/}
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        data={data}
      />
    </>
  );
}

export default PostBody;
