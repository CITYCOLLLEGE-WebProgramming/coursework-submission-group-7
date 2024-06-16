import { useContext, useState } from "react";
import "./profileUpdatePage.css";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [avatar, setAvatar] = useState([]);
  const navigate = useNavigate();

  const handleAvatarChange = (newAvatar) => {
    if (newAvatar.length > 0) {
      setAvatar(newAvatar);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        avatar: avatar[0]
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="profile-update-page">
      <section className="form-container">
        <form onSubmit={handleSubmit} className="profile-form">
          <h1>Update Profile Avatar</h1>
          <div className="side-container">
            <img
              src={avatar[0] || currentUser.avatar || "/noavatar.jpg"}
              alt="Avatar"
              className="avatar-img"
            />
            <UploadWidget
              uwConfig={{
                multiple: false,
                cloudName: "do0bruuzy", //cloudinary gave us this cloud name
                uploadPreset: "realestate",
                maxImageFileSize: 2500000,
                folder: "avatars",
              }}
              setState={handleAvatarChange}
            />
            {avatar.length > 0 && (
              <button type="button" onClick={handleRemoveAvatar} className="remove-btn">Remove Picture</button>
            )}
          </div>
          <button type="submit" className="submit-btn">Update Avatar</button>
        </form>
      </section>
    </main>
  );
}

export default ProfileUpdatePage;
