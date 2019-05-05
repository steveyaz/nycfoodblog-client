import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RequestClient } from "../data/RequestClient";
import { setAllPosts, setAllReviews, setUsernames } from "../redux/action";
import { WirePost } from "./WirePost";
import { WireReview } from "./WireReview";

export namespace DataProvider {

  interface StoreProps {
    setUsernames: (usernames: ReadonlyArray<string>) => void;
    setAllPosts: (postMap: { [postId: number]: WirePost }) => void;
    setAllReviews: (reviewMap: { [postId: number]: ReadonlyArray<WireReview> }) => void;
  }

  export type Props = StoreProps;

}

class DataProviderInternal extends React.PureComponent<DataProvider.Props> {

  public render() {
    return this.props.children;
  }

  public componentDidMount() {
    const usernamesPromise = RequestClient.getInstance().getAllUsernames();
    const postsPromise = RequestClient.getInstance().getAllPosts();
    const reviewsPromise = RequestClient.getInstance().getAllReviews();
    Promise.all([usernamesPromise, postsPromise, reviewsPromise])
      .then(allPromises => {
        this.props.setUsernames(allPromises[0]);
        this.props.setAllPosts(allPromises[1]);
        this.props.setAllReviews(allPromises[2]);
      });
  }

}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setUsernames: (usernames: Array<string>) => dispatch(setUsernames(usernames)),
    setAllPosts: (postMap: { [postId: number]: WirePost }) => dispatch(setAllPosts(postMap)),
    setAllReviews: (reviewMap: { [postId: number]: ReadonlyArray<WireReview> }) => dispatch(setAllReviews(reviewMap)),
  };
};

export const DataProvider = connect(null, mapDispatchToProps)(DataProviderInternal);
