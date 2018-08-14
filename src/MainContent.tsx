import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RequestClient } from "./data/RequestClient";
import { WirePost } from "./data/WirePost";
import { WireReview } from "./data/WireReview";
import { Post } from "./post/Post";
import { PostForm } from "./post/PostForm";
import { setView } from "./redux/action";
import { AppState, VIEW_TYPE } from "./redux/state";
import { ReviewForm } from "./review/ReviewForm";

export namespace MainContent {

  interface StoreProps {
    authedUsername?: string;
    view: VIEW_TYPE;
    setView: (viewType: VIEW_TYPE) => void;
  }

  export type Props = StoreProps;

  export interface State {
    posts: Array<WirePost>;
    reviewMap: { [postId: number]: WireReview[] };
    displayAuth: boolean;
    activePostId?: number;
    usernames: Array<string>;
  }

}

const EMPTY_POST_ARRAY: WirePost[] = [];
const EMPTY_MAP = {};
const EMPTY_STRING_LIST: Array<string> = [];

class MainContentInternal extends React.PureComponent<MainContent.Props, MainContent.State> {
  public state: MainContent.State = { posts: EMPTY_POST_ARRAY, reviewMap: EMPTY_MAP, displayAuth: false, usernames: EMPTY_STRING_LIST };

  public render() {
    return (
      <div className="content">
        {this.props.view === "ALL_POSTS" &&
          <div>
            <div className="posts">
              {this.state.posts
                .sort((a: WirePost, b: WirePost) => {
                  return a.dateVisited < b.dateVisited ? 1 : -1;
                }).map((post: WirePost) => {
                  return (
                    <Post
                      key={post.id!}
                      post={post}
                      reviews={this.state.reviewMap[post.id!]}
                      viewEditPost={this.viewAddOrEditPost}
                      viewAddOrEditReview={this.viewAddOrEditReview}
                      authedUsername={this.props.authedUsername}
                    />);
                })}
            </div>
          </div>
        }
        {this.props.view === "ADD_OR_EDIT_POST" &&
          <PostForm
            previousPost={this.getActivePost()}
            createPost={this.createPost}
            closeForm={this.viewAllPosts}
          />
        }
        {(this.props.view === "ADD_OR_EDIT_REVIEW") && (this.props.authedUsername !== undefined) &&
          <ReviewForm
            username={this.props.authedUsername}
            postId={this.getActivePost()!.id!}
            previousReview={this.getActiveReview()}
            createReview={this.createReview}
            closeForm={this.viewAllPosts}
          />
        }
      </div>
    );
  }

  public componentDidMount() {
    this.retrieveAllData();
  }

  private retrieveAllData() {
    const usernamesPromise = RequestClient.getInstance().getAllUsernames();
    const postsPromise = RequestClient.getInstance().getAllPosts();
    Promise.all([postsPromise, usernamesPromise])
      .then(values => {
        const reviewPromises = [];
        this.setState({ posts: values[0], usernames: values[1] });
        for (const username of values[1]) {
          for (const post of values[0]) {
            reviewPromises.push(RequestClient.getInstance().getReview(username.toLowerCase(), post.id!));
          }
        }
        Promise.all(reviewPromises)
          .then(reviews => {
            const tempReviewMap: { [postId: number]: WireReview[] } = {};
            for (const review of reviews) {
              if (review === undefined) {
                // NOOP
              } else if (tempReviewMap[review.postId!] === undefined) {
                tempReviewMap[review.postId!] = [review];
              } else {
                tempReviewMap[review.postId!] = [review, ...tempReviewMap[review.postId!]]
              }
            }
            this.setState({reviewMap: tempReviewMap});
          });
      });
  }

  private viewAddOrEditPost = (postId: number | undefined) => {
    this.setState({ activePostId: postId });
    this.props.setView("ADD_OR_EDIT_POST");
  }

  private viewAddOrEditReview = (postId: number) => {
    this.setState({ activePostId: postId });
    this.props.setView("ADD_OR_EDIT_REVIEW");

  }

  private viewAllPosts = () => {
    if (this.props.view === "ALL_POSTS") {
      location.reload(true);
    } else {
      this.props.setView("ALL_POSTS");
    }
  }

  private createPost = (post: WirePost) => {
    RequestClient.getInstance().createPost(post)
      .then(id => {
        post.id = id;
        const filteredPosts = this.state.posts.filter(oldPost => oldPost.id !== post.id);
        this.setState({ posts: [post, ...filteredPosts] });
        this.props.setView("ALL_POSTS");
      });
  }

  private createReview = (review: WireReview) => {
    RequestClient.getInstance().createReview(review)
      .then(() => {
        this.props.setView("ALL_POSTS");
      });
  }

  private getActiveReview = () => {
    if (this.state.activePostId === undefined || this.props.authedUsername === undefined || this.state.reviewMap[this.state.activePostId] === undefined) {
      return undefined;
    }
    return this.state.reviewMap[this.state.activePostId].find(review => review.username === this.props.authedUsername)
  }

  private getActivePost = () => {
    if (this.state.activePostId === undefined) {
      return undefined;
    }
    return this.state.posts.find(post => post.id === this.state.activePostId)
  }

}

const mapStateToProps = (state: AppState) => {
  return {
    authedUsername: state.authedUsername,
    view: state.view,
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setView: (viewType: VIEW_TYPE) => dispatch(setView(viewType))
  };
};

export const MainContent = connect(mapStateToProps, mapDispatchToProps)(MainContentInternal);
