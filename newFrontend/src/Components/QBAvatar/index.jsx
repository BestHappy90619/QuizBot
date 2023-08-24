const QBAvatar = ({
  src,
  color = "yellow",
  size = "20px",
  radius = "10px",
}) => {
  return (
    <>
      <img
        src={`${src}`}
        className={`border-2 p-2 ${size}`}
        style={{
          borderRadius: `${radius}`,
          width: size,
          height: size,
          border: `2px dashed ${color}`,
          maxWidth: "300px",
        }}
      />
    </>
  );
};

export default QBAvatar;
