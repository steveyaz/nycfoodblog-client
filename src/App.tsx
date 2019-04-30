import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import * as React from "react";
import { Provider } from "react-redux";
import { Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import "./App.css";
import { Header } from "./header/Header";
import { MainContent } from "./MainContent";
import { PostPage } from "./post/PostPage";
import { reducer } from "./redux/reducer";

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
        <BrowserRouter>
          <div className="app">
            <Header />
            <Route exact={true} path="/" component={MainContent} />
            <Route exact={true} path="/post/:postId" component={PostPage} />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }

}

export default App;
