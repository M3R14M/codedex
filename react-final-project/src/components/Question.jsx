export default function Question({ question, options, onAnswer }) {
  return (
    <>
      <h2>{question}</h2>
      <button-container>
        {options.map(function (option) {
          return (
            <button
              key={option}
              onClick={function () {
                onAnswer(option);
              }}
            >
              {option}
            </button>
          );
        })}
      </button-container>
    </>
  );
}
