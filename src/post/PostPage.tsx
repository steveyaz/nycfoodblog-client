import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { RequestClient } from "../data/RequestClient";
import { WirePost } from "../data/WirePost";
import { WireReview } from "../data/WireReview";
import { setAllReviews, setPost } from "../redux/action";
import { AppState } from "../redux/state";
import { NEIGHBORHOODS } from "../static/constants";

export namespace PostPage {

  export interface OwnProps {
    postId: string;
  }

  export interface StoreProps {
    post: WirePost | undefined;
    reviews: ReadonlyArray<WireReview>;
    setPost: (post: WirePost ) => void;
    setAllReviews: (reviewMap: { [postId: number]: Array<WireReview> }) => void;
  }

  export type Props = RouteComponentProps<PostPage.OwnProps> & StoreProps;

  export interface State {
    isLoading: boolean;
  }

}

class PostPageInternal extends React.PureComponent<PostPage.Props, {}> {

  public state: PostPage.State = { isLoading: false }

  constructor(props: PostPage.Props) {
    super(props);
  }

  public render() {
    if (this.props.post === undefined) {
      return (
        <div className="post">
          LOADING
        </div>
      );
    } else {
      return (
        <div className="post">
          <div className="post-below-image">
            <div className="post-description">
              <div className="restaurant-name">{this.props.post.restaurantName}</div>
              <div className="location">{NEIGHBORHOODS.get(this.props.post.neighborhood)}</div>
            </div>
            <div className="post-tags">
              {this.props.post.tags && this.props.post.tags.map(tag => {
                return <div key={tag} className="tag">{tag}</div>
              })}
            </div>
          </div>
        </div>
      );
    }
  }

  public componentDidMount() {
    const postId = parseInt(this.props.match.params.postId, 10);
    const postPromise = RequestClient.getInstance().getPost(postId);
    const reviewsPromise = RequestClient.getInstance().getReviews(postId);
    Promise.all([postPromise, reviewsPromise])
      .then(postAndReviews => {
        this.props.setPost(postAndReviews[0]);
        const reviewMap = {};
        reviewMap[postId] = postAndReviews[1];
        this.props.setAllReviews(reviewMap);
      });
  }

}

const mapStateToProps = (state: AppState, props: PostPage.Props) => {
  const postId = parseInt(props.match.params.postId, 10);
  return {
    post: state.postMap[postId],
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setPost: (post: WirePost ) => dispatch(setPost(post)),
    setAllReviews: (reviewMap: { [postId: number]: Array<WireReview> }) => dispatch(setAllReviews(reviewMap)),
  };
};

export const PostPage = connect(mapStateToProps, mapDispatchToProps)(PostPageInternal);
