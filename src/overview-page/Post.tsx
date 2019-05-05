import { Icon } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import { WirePost } from "../data/WirePost";
import { WireReview } from "../data/WireReview";
import { setPost } from "../redux/action";
import { AppState } from "../redux/state";
import { NEIGHBORHOODS } from "../static/constants";

export namespace Post {

  export interface OwnProps {
    postId: number;
    setActivePost: (postId: number) => void;
    onAddLocationFilter: (neighborhood: string) => void;
  }

  export interface StoreProps {
    setPost: (post: WirePost) => void;
    post: WirePost;
    reviews: ReadonlyArray<WireReview>;
  }

  export type Props = OwnProps & StoreProps;

}

const getBackgroundUrl = (instagramUrl: string) => {
  const regex = /https\:\/\/www\.instagram\.com\/p\/.+\//i;
  return instagramUrl.match(regex) + "media/?size=m";
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

class PostInternal extends React.PureComponent<Post.Props, {}> {

  public render() {
    if (this.props.post.instagramUrl.trim().length === 0 || this.props.reviews.length !== 2) {
      return <div />;
    }
    const backgroundImage = this.props.post.instagramUrl ?
      { backgroundImage: "url('" + getBackgroundUrl(this.props.post.instagramUrl) + "')" }
      : {};
    return (
      <div className="post">
        <div className="post-score">{getReviewScore(this.props.reviews)}</div>
        <div className="post-image" style={backgroundImage} />
        <div className="post-below-image">
          <div className="post-description">
            <div className="restaurant-name">{this.props.post.restaurantName}</div>
            <div className="location" onClick={this.onLocationClick}>{NEIGHBORHOODS.get(this.props.post.neighborhood)}</div>
          </div>
          <div className="post-tags">
            {this.props.post.tags && this.props.post.tags.map(tag => {
              return <div key={tag} className="tag">{tag}</div>
            })}
            <Link className="post-expand" to={`/post/${this.props.postId}`}><Icon className="post-expand-button" icon="share" />See review... </Link>
          </div>
        </div>
      </div>
    );
  }

  private onLocationClick = () => {
    const post: WirePost = this.props.post;
    this.props.onAddLocationFilter(post.neighborhood);
  }
}

const mapStateToProps = (state: AppState, ownProps: Post.OwnProps) => {
  return {
    post: state.postMap[ownProps.postId],
    reviews: state.reviewMap[ownProps.postId] || [],
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setPost: (post: WirePost) => dispatch(setPost(post)),
  };
};

export const Post = connect(mapStateToProps, mapDispatchToProps)(PostInternal);
