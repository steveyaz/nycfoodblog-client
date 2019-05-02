import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import * as React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import { createStore } from "redux";
import { MainContent } from "../main/MainContent";
import { PostPage } from "../post/PostPage";
import { reducer } from "../redux/reducer";
import "./App.css";
import { Header } from "./Header";

const store = createStore(reducer);

export class App extends React.Component {

  public render() {
    return (
      <Provider store={store}>
        <div className="app-content">
          <BrowserRouter>
            <Header />
            <Route exact={true} path="/" component={MainContent} />
            <Route exact={true} path="/post/:postId" component={PostPage} />
          </BrowserRouter>
        </div>
      </Provider>
    );
  }

}

export default App;
