import * as React from "react";
import { Auth } from "../auth/Auth";
import logo from "../static/rosie.png";

export namespace Header {
  export interface State {
    displayAuth: boolean;
  }
}

export class Header extends React.Component<{}, Header.State> {
  public state: Header.State = { displayAuth: false };

  public render() {
    return (
      <div className="header-wrapper">
        <div className="easter-egg" onClick={this.toggleAuthDisplay}>❤️ Sonya</div>
        <header className="header">
          <img src={logo} className="header-logo" alt="Rosie!" />
          <h1 className="header-title">The NYC Food Blog</h1>
        </header>
        { this.state.displayAuth && <Auth /> }
      </div>
    );
  }

  private toggleAuthDisplay = () => {
    this.setState({ displayAuth: !this.state.displayAuth });
  }

}
