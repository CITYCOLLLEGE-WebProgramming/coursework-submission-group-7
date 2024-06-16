import List from "../../components/List/List";
import "./profilePage.css";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const data = useLoaderData();

  const { updateUser, currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="profile-page">
      <section className="profile-details">
        <div className="details-wrapper">
          <header className="section-header">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button className="add-avatar-btn">Add avatar</button>
            </Link>
          </header>
          <div className="user-info">
            <div className="info-item">
              <span>Avatar:</span>
              <img src={currentUser.avatar || "noavatar.jpg"} alt="User Avatar" />
            </div>
            <div className="info-item">
              <span>Username:</span> <b>{currentUser.username}</b>
            </div>
            <div className="info-item">
              <span>E-mail:</span> <b>{currentUser.email}</b>
            </div>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
          <header className="section-header">
            <h1>My Posts</h1>
            <Link to="/add">
              <button className="create-post-btn">Create New Post</button>
            </Link>
          </header>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => (
                <List posts={postResponse.data.userPosts.filter(post => !post.acquired)} />
              )}
            </Await>
          </Suspense>
          <header className="section-header">
            <h1>Acquired Posts</h1>
          </header>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.acquiredPosts} />}
            </Await>
          </Suspense>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
