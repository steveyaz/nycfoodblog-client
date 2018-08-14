import * as React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import "./App.css";
import { Auth } from "./auth/Auth";
import "./form/FormField.css";
import { MainContent } from "./MainContent";
import { reducer } from "./redux/reducer";
import logo from "./rosie.png";

const store = createStore(reducer);

export namespace App {
  export interface State {
    displayAuth: boolean;
  }
}

export class App extends React.Component<{}, App.State> {
  public state: App.State = { displayAuth: false };

  public render() {
    return (
      <Provider store={store}>
        <div className="app">
          <div className="easterEgg" onClick={this.toggleAuthDisplay}>❤️ Sonya</div>
          <header className="header">
            <img src={logo} className="logo" alt="Rosie!" />
            <h1 className="title">The NYC Food Blog</h1>
          </header>
          { this.state.displayAuth && <Auth /> }
          <MainContent />
        </div>
      </Provider>
    );
  }

  private toggleAuthDisplay = () => {
    this.setState({ displayAuth: !this.state.displayAuth });
  }

}

export default App;
