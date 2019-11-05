import React from "react";

const ErrorPage = ({ error }) => {
  error = error || {};
  return (
    <React.Fragment>
      <div>An error has been encountered</div>
      <div>Status: {error.status}</div>
      <div>Message: {error.message}</div>
    </React.Fragment>
  );
};

export default ErrorPage;
