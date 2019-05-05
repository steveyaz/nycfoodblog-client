import * as React from "react";
import { Link } from "react-router-dom";
import logo from "../static/rosie.png";

export class Header extends React.Component {

  public render() {
    return (
      <div className="header-wrapper">
        <Link className="easter-egg" to={`/admin`}>❤️ Sonya</Link>
        <header className="header">
          <Link to={`/`}><img src={logo} className="header-logo" alt="Rosie!" /></Link>
          <h1 className="header-title">The NYC Food Blog</h1>
        </header>
      </div>
    );
  }

}
