import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import * as React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import { createStore } from "redux";
import { AdminPage } from "../admin-page/AdminPage";
import { MainContent } from "../overview-page/MainContent";
import { PostPage } from "../post-page/PostPage";
import { reducer } from "../redux/reducer";
import "./App.css";
import { Header } from "./Header";
import { ScrollToTop } from "./ScrollToTop";

const store = createStore(reducer);

export class App extends React.Component {

  public render() {
    return (
      <Provider store={store}>
        <div className="app-content">
          <BrowserRouter>
            <ScrollToTop>
              <Header />
              <Route exact={true} path="/" component={MainContent} />
              <Route exact={true} path="/post/:postId" component={PostPage} />
              <Route exact={true} path="/admin" component={AdminPage} />
            </ScrollToTop>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }

}

export default App;
