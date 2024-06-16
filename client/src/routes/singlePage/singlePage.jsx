import "./singlePage.css";
import Slider from "../../components/Slider/Slider";
import Map from "../../components/Map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAcquire = async () => {
    if (!currentUser) {
      navigate("/register");
      return;
    }

    if (currentUser.id === post.userId) {
      alert("You cannot acquire your own post");
      return;
    }

    try {
      const res = await apiRequest.post("/posts/acquire", { postId: post.id });
      alert(res.data.message);
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await apiRequest.delete(`/posts/${post.id}`);
      alert("Post deleted successfully");
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="singlePage">
      <section className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <article className="info">
            <header className="top">
              <div className="post">
                <h1>Title: {post.title}</h1>
                <p className="address">
                  <img src="/pin.png" alt="" />
                  <span>Address: {post.address}</span>
                </p>
                <p className="price">Price: $ {post.price}</p>
              </div>
              <div className="user">
                <div className="avatarContainer">
                  <img src={post.user.avatar} alt="" />
                </div>
                <span>Posted by: {post.user.username}</span>
              </div>
            </header>
            <section className="description">
              <h2>Brief Description</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.postDetail.desc),
                }}
              ></div>
            </section>
          </article>
        </div>
      </section>
      <aside className="features">
        <div className="wrapper">
          <h2 className="title">Home properties</h2>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <h2 className="title">Points of interest</h2>
          <div className="points-of-interest">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/bus-stop.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>
                  {post.postDetail.bus > 999
                    ? post.postDetail.bus / 1000 + "km"
                    : post.postDetail.bus + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/hospital.png" alt="" />
              <div className="featureText">
                <span>Hospital</span>
                <p>
                  {post.postDetail.hospital > 999
                    ? post.postDetail.hospital / 1000 + "km"
                    : post.postDetail.hospital + "m"}{" "}
                  away
                </p>
              </div>
            </div>
          </div>
          <h2 className="title">Location</h2>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button onClick={handleAcquire}>
              <img src="/acquire.png" alt="" />
              Acquire Post
            </button>
            {currentUser && currentUser.id === post.userId && (
              <button onClick={handleDelete}>
                <img src="/delete.png" alt="" />
                Delete Post
              </button>
            )}
          </div>
        </div>
      </aside>
    </main>
  );
}

export default SinglePage;
