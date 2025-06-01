import React from "react";
import { Link } from "react-router-dom";
import notfound from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={notfound.notFoundContainer}>
      <h1 className={notfound.notFoundTitle}>404 - Page Not Found</h1>
      <p className={notfound.notFoundText}>The page you're looking for does not exist.</p>
      <Link to="/" className={notfound.notFoundLink}>Go to Home</Link>
    </div>
  );
};

export default NotFoundPage;
