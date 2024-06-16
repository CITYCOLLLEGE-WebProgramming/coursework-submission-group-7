import "./listPage.css";
import Filter from "../../components/Filter/Filter";
import Card from "../../components/Card/Card";
import Map from "../../components/Map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense, useState } from "react";

function ListPage() {
  const data = useLoaderData();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const handleNextPage = (totalPosts) => {
    if (currentPage < Math.ceil(totalPosts / postsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="listPage">
      <section className="listSection">
        <div className="listWrapper">
          <Filter />
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => {
                const totalPosts = postResponse.data.length;
                const startIndex = (currentPage - 1) * postsPerPage;
                const endIndex = startIndex + postsPerPage;
                const currentPosts = postResponse.data.slice(startIndex, endIndex);

                return (
                  <>
                    {totalPosts === 0 ? (
                      <p>No current listings for the specific search</p>
                    ) : (
                      <>
                        {currentPosts.map((post) => (
                          <Card key={post.id} item={post} />
                        ))}
                        {totalPosts > postsPerPage && (
                          <div className="pagination">
                            <button
                              onClick={handlePreviousPage}
                              disabled={currentPage === 1}
                              className="pagination-button"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => handleNextPage(totalPosts)}
                              disabled={endIndex >= totalPosts}
                              className="pagination-button"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                );
              }}
            </Await>
          </Suspense>
        </div>
      </section>
      <aside className="mapSection">
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading posts!</p>}
          >
            {(postResponse) => {
              const totalPosts = postResponse.data.length;
              return totalPosts === 0 ? (
                <p>No current listings for the specific search</p>
              ) : (
                <Map items={postResponse.data} />
              );
            }}
          </Await>
        </Suspense>
      </aside>
    </div>
  );
}

export default ListPage;
