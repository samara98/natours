import React from 'react';

const ErrorPage: React.FC<{ msg?: string }> = (props) => {
  return (
    <main className="main">
      <div className="error">
        <div className="error__title">
          <h2 className="heading-secondary heading-secondary--error">
            Uh oh! Something went wrong!
          </h2>
          <h2 className="error__emoji">😢 🤯</h2>
        </div>
        <div className="error__msg">{props.msg}</div>
      </div>
    </main>
  );
};

export default ErrorPage;
