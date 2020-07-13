import React from 'react';
import { Link } from 'react-router-dom';

import '../App.css';

class ErrorPage extends React.Component {
  render() {
    return (
      <div className="error-page main-content">
        <h1>Uh oh! Page Not Found</h1>
        <br />
        <p>
        Looks like you lost your way. <Link to="/">Click here</Link> to go back to the homepage.
        </p>
      </div>
    );
  }
}

export default ErrorPage;
