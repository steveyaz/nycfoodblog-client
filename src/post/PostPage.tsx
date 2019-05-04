import { Icon } from "@blueprintjs/core";
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

  export interface RouterProps {
    postId: string;
  }

  export interface StoreProps {
    post: WirePost | undefined;
    reviews: ReadonlyArray<WireReview>;
    setPost: (post: WirePost ) => void;
    setAllReviews: (reviewMap: { [postId: number]: Array<WireReview> }) => void;
  }

  export type Props = RouteComponentProps<PostPage.RouterProps> & StoreProps;

  export interface State {
    isLoading: boolean;
    instagramContentHight: number;
  }

}

const getEmbedUrl = (instagramUrl: string): string => {
  const regex = /https\:\/\/www\.instagram\.com\/p\/.+\//i;
  return instagramUrl.match(regex) + "embed";
}

const getReviewScore = (reviews: ReadonlyArray<WireReview>): string => {
  if (reviews.length === 0) {
    return "?";
  }
  let score = 0;
  reviews.forEach(review => {
    score += review.ecRating + review.foodRating + review.vibesRating;
  });
  return (score / reviews.length).toString();
}

const getCasedUsername = (username: string): string => {
  let casedUsername = username.toLowerCase();
  const firstLetter = casedUsername.charAt(0).toUpperCase();
  casedUsername = firstLetter + casedUsername.slice(1, casedUsername.length);
  return casedUsername;
}

const getOrderString = (order: ReadonlyArray<string>): string => {
  let orderString = "We ordered... ";
  order.forEach(item => orderString += item.toLowerCase() + ", ");
  if (order.length !== 0) {
    orderString = orderString.slice(0, -2);
  }
  return orderString;
}

class PostPageInternal extends React.PureComponent<PostPage.Props, {}> {

  public state: PostPage.State = { isLoading: false, instagramContentHight: 0 }

  constructor(props: PostPage.Props) {
    super(props);
  }

  public render() {
    if (this.props.post === undefined) {
      return (
        <div className="post-page">
          LOADING
        </div>
      );
    } else {
      return (
        <div className="postpage">
          <div className="postpage-header">
            <div className="postpage-restaurant-name">{this.props.post.restaurantName}</div>
            <div className="postpage-neighborhood">{NEIGHBORHOODS.get(this.props.post.neighborhood)}</div>
            <div className="postpage-address">{this.props.post.addressStreet}</div>
            <div className="postpage-address">{this.props.post.addressCity}, {this.props.post.addressState} {this.props.post.addressZip}</div>
          </div>
          <div className="postpage-content">
            <div className="postpage-review-section">
              <div className="postpage-top">
                <div className="postpage-review-overview">
                  <div className="postpage-score">
                    {getReviewScore(this.props.reviews)}
                    <div className="postpage-score-outof">/10</div>
                  </div>
                </div>
                <div className="postpage-review-secondary">
                  <div className="postpage-order">{getOrderString(this.props.post.order)}</div>
                  <div className="postpage-price">${this.props.post.cost}</div>
                  <div className="postpage-tags">
                    {this.props.post.tags && this.props.post.tags.map(tag => {
                      return <div key={tag} className="tag">{tag}</div>
                    })}
                  </div>
                </div>
              </div>
              <div className="postpage-bottom">
                {this.props.reviews.map(review => { return (
                  <div className="postpage-review" key={review.postId + review.username}>
                    <div className="postpage-review-name">{getCasedUsername(review.username)}</div>
                    <div className="postpage-review-content">
                      <div className="postpage-review-left">
                        <div className="postpage-review-score">
                          <div className="postpage-review-score-category">Overall: </div>
                          <div className="postpage-review-score-value">{review.foodRating + review.vibesRating + review.ecRating}</div>
                        </div>
                        <div className="postpage-review-score">
                          <div className="postpage-review-score-category">Food: </div>
                          <div className="postpage-review-score-value">{review.foodRating}</div>
                        </div>
                        <div className="postpage-review-score">
                          <div className="postpage-review-score-category">Vibes: </div>
                          <div className="postpage-review-score-value">{review.vibesRating}</div>
                        </div>
                        <div className="postpage-review-score">
                          <div className="postpage-review-score-category">EC: </div>
                          <div className="postpage-review-score-value">{review.ecRating}</div>
                        </div>
                      </div>
                      <div className="postpage-review-right">
                        <Icon className="postpage-review-quote" icon="citation" />
                        {review.text}
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
            <div className="postpage-instagram-section">
              <iframe id="postpage-instagram-iframe" className="postpage-instagram-iframe" src={getEmbedUrl(this.props.post.instagramUrl)} />
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
    reviews: state.reviewMap[postId] !== undefined ? state.reviewMap[postId] : [],
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setPost: (post: WirePost ) => dispatch(setPost(post)),
    setAllReviews: (reviewMap: { [postId: number]: Array<WireReview> }) => dispatch(setAllReviews(reviewMap)),
  };
};

export const PostPage = connect(mapStateToProps, mapDispatchToProps)(PostPageInternal);
