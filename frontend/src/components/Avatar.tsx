import React from "react";

interface AvatarProps {
  name?: string | null;
  photo?: string | null;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ name, photo, size = 36 }) => {
  const firstLetter = name?.charAt(0)?.toUpperCase() || "?";

  if (photo) {
    return (
      <img
        src={photo}
        alt={name || "User"}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #ff3366, #ff6699)",
        color: "white",
        fontFamily: "'Pacifico', cursive",
        fontSize: size * 0.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid white",
      }}
    >
      {firstLetter}
    </div>
  );
};

export default Avatar;
