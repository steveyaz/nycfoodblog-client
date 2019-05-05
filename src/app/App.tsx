import * as React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import { createStore } from "redux";
import { AdminPage } from "../admin-page/AdminPage";
import { DataProvider } from "../data/DataProvider";
import { MainContent } from "../overview-page/MainContent";
import { PostPage } from "../post-page/PostPage";
import { reducer } from "../redux/reducer";
import { Header } from "./Header";
import { ScrollToTop } from "./ScrollToTop";

const store = createStore(reducer);

export class App extends React.Component {

  public render() {
    return (
      <Provider store={store}>
        <DataProvider>
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
        </DataProvider>
      </Provider>
    );
  }

}

export default App;
