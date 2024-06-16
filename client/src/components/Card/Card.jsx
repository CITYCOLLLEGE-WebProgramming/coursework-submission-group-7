import { useContext } from "react";
import apiRequest from "../../lib/apiRequest";
import { Link } from "react-router-dom";
import "./Card.css";

function Card({ item }) {
  const handleAcquire = async () => {
    try {
      const res = await apiRequest.post("/posts/acquire", { postId: item.id });
      alert(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon" onClick={handleAcquire}>
              <img src="/acquire.png" alt="Acquire" />
            </div>
            <div className="icon">
              <img src="/delete.png" alt="Delete" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;