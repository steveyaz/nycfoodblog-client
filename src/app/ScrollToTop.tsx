import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

class ScrollToTopInternal extends React.Component<RouteComponentProps> {

  public render() {
    return this.props.children;
  }

  public componentDidUpdate(prevProps: RouteComponentProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

}

export const ScrollToTop = withRouter(ScrollToTopInternal);
