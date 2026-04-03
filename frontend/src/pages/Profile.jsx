import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

export default function Profile() {

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Password section
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken || storedToken === "[object Object]") return;

    try {
      const res = await axios.get(
        "https://expense-tracker-ldlx.onrender.com/api/auth/profile",
        {
          headers: { Authorization: `Bearer ${storedToken}` }
        }
      );

      setUser(res.data);
      setEditedName(res.data.name);

    } catch (error) {
      console.error("Profile fetch failed:", error.response?.data || error.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  const hasChanges =
    editedName !== user?.name || file !== null;

  const handleSave = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken || !hasChanges) return;

    try {

      // Update name
      if (editedName !== user.name) {
        await axios.put(
          "https://expense-tracker-ldlx.onrender.com/api/auth/profile",
          { name: editedName },
          {
            headers: { Authorization: `Bearer ${storedToken}` }
          }
        );
      }

      // Update image
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post(
          "https://expense-tracker-ldlx.onrender.com/api/auth/profile/upload",
          formData,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
            "Content-Type": "multipart/form-data"
          }
        );
      }

      await fetchProfile();
      setIsEditing(false);
      setFile(null);
      setPreviewImage(null);

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
    }
  };

  const handleCancel = () => {
    setEditedName(user.name);
    setFile(null);
    setPreviewImage(null);
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken || !currentPassword || !newPassword) return;

    try {
      await axios.put(
        "https://expense-tracker-ldlx.onrender.com/api/auth/change-password",
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${storedToken}` }
        }
      );

      setSuccessMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      console.error("Password update failed:", error.response?.data || error.message);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
  <div className="profile-container">
    <div className="profile-card">

      {/* ===== HEADER SECTION ===== */}
      <div className="profile-header">

        {/* Left Side - Image */}
        <div className="header-left">
          <img
            src={
              previewImage
                ? previewImage
                : user.profileImage
                  ? `https://expense-tracker-ldlx.onrender.com/uploads/${user.profileImage}?t=${Date.now()}`
                  : "https://via.placeholder.com/120"
            }
            alt="Profile" className="image-section"
          />

          {isEditing && (
            <div className="file-upload">
              <label className="upload-btn">
                Choose Photo
                <input
                  type="file"
                  onChange={handleFileChange}
                  hidden
                />
              </label>
            </div>
          )}
        </div>

        {/* Right Side - Headline Info */}
        <div className="header-right">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>

      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* ===== DETAILS SECTION ===== */}
      <div className="profile-details">

        {/* Name */}
        <div className="profile-row">
          <label>Name:</label>

          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
          ) : (
            <span>{user.name}</span>
          )}
        </div>

        {/* Email */}
        <div className="profile-row">
          <label>Email:</label>
          <span>{user.email}</span>
        </div>

      </div>

      {/* Edit Buttons */}
      <div className="profile-actions">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={!hasChanges ? "disabled-btn" : ""}
            >
              Save
            </button>
            <button onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      {/* ===== PASSWORD SECTION ===== */}
      <div className="password-section">
        <h3>Change Password</h3>

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          disabled={!currentPassword || !newPassword}
          onClick={handlePasswordChange}
        >
          Update Password
        </button>
      </div>

    </div>
  </div>
);
}