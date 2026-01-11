function renderCaption(text, navigate) {
  if (!text) return null;

  return text.split(" ").map((word, index) => {
    if (word.startsWith("#")) {
      return (
        <span
          key={index}
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/plhashtag/${word.substring(1)}`);
          }}
        >
          {word}{" "}
        </span>
      );
    }

    return <span key={index}>{word} </span>;
  });
}

export default renderCaption;
