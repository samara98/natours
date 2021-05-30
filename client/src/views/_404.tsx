import React from 'react';

const NotFound: React.FC = () => {
  return (
    <main className="main">
      <div className="error">
        <div className="error__title">
          <h2 className="heading-secondary heading-secondary--error">404 | Not Found</h2>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
