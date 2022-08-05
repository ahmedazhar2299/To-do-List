exports.generateDateTime = () => {
  const Today = new Date();
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return Today.toLocaleTimeString("en-UK", options);
};
