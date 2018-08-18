import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RequestClient } from "./data/RequestClient";
import { WirePost } from "./data/WirePost";
import { WireReview } from "./data/WireReview";
import { Post } from "./post/Post";
import { PostForm } from "./post/PostForm";
import { setAllPosts, setAllReviews, setPostIds, setUsernames, setView } from "./redux/action";
import { AppState, VIEW_TYPE } from "./redux/state";
import { ReviewForm } from "./review/ReviewForm";

export namespace MainContent {

  interface StoreProps {
    view: VIEW_TYPE;
    authedUsername?: string;
    postIds: Array<number>;
    setView: (viewType: VIEW_TYPE) => void;
    setPostIds: (postIds: Array<number>) => void;
    setUsernames: (usernames: Array<string>) => void;
    setAllPosts: (postMap: { [postId: number]: WirePost }) => void;
    setAllReviews: (reviewMap: { [postId: number]: Array<WireReview> }) => void;
  }

  export type Props = StoreProps;

  export interface State {
    displayAuth: boolean;
    activePostId?: number;
  }

}

class MainContentInternal extends React.PureComponent<MainContent.Props, MainContent.State> {
  public state: MainContent.State = { displayAuth: false };

  public render() {
    return (
      <div className="content">
        { (this.props.view === "ALL_POSTS") &&
          <div className="posts">
            {this.props.postIds
              .map((postId: number) => {
                return (
                  <Post
                    key={postId}
                    postId={postId}
                    setActivePost={this.setActivePost}
                  />);
              })}
          </div>
        }
        { (this.props.view === "ADD_OR_EDIT_POST") &&
          <PostForm
            postId={this.state.activePostId}
          />
        }
        { (this.props.view === "ADD_OR_EDIT_REVIEW") &&
          <ReviewForm
            postId={this.state.activePostId!}
          />
        }
      </div>
    );
  }

  public componentDidMount() {
    const usernamesPromise = RequestClient.getInstance().getAllUsernames();
    const postsPromise = RequestClient.getInstance().getAllPostsIds();
    Promise.all([postsPromise, usernamesPromise])
      .then(postIdsAndUsernames => {
        this.props.setPostIds(postIdsAndUsernames[0]);
        this.props.setUsernames(postIdsAndUsernames[1]);
        const postPromises = [];
        const reviewPromises = [];
        for (const postId of postIdsAndUsernames[0]) {
          postPromises.push(RequestClient.getInstance().getPost(postId));
          reviewPromises.push(RequestClient.getInstance().getReviews(postId));
        }
        Promise.all([Promise.all(postPromises), Promise.all(reviewPromises)])
          .then(postsAndReviews => {
            const postMap = {};
            for (const post of postsAndReviews[0]) {
              postMap[post.id!] = post;
            }
            this.props.setAllPosts(postMap);
            const reviewMap = {};
            for (const reviews of postsAndReviews[1]) {
              if (reviews.length > 0) {
                reviewMap[reviews[0].postId] = reviews;
              }
            }
            this.props.setAllReviews(reviewMap);
          });
      });
  }

  private setActivePost = (postId: number) => {
    this.setState({ activePostId: postId });
  }

}

const mapStateToProps = (state: AppState) => {
  return {
    view: state.view,
    authedUsername: state.authedUsername,
    postIds: state.postIds,
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setView: (viewType: VIEW_TYPE) => dispatch(setView(viewType)),
    setPostIds: (postIds: Array<number>) => dispatch(setPostIds(postIds)),
    setUsernames: (usernames: Array<string>) => dispatch(setUsernames(usernames)),
    setAllPosts: (postMap: { [postId: number]: WirePost }) => dispatch(setAllPosts(postMap)),
    setAllReviews: (reviewMap: { [postId: number]: Array<WireReview> }) => dispatch(setAllReviews(reviewMap)),
  };
};

export const MainContent = connect(mapStateToProps, mapDispatchToProps)(MainContentInternal);
