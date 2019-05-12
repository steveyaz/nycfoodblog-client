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
    onAddLocationFilter: (neighborhood: string) => void;
  }

  export interface StoreProps {
    setPost: (post: WirePost) => void;
    post: WirePost;
    reviews: ReadonlyArray<WireReview>;
  }

  export type Props = OwnProps & StoreProps;

}

export const isPostComplete = (post: WirePost, reviews: ReadonlyArray<WireReview>): boolean => {
  return post.id !== undefined
    && post.addressCity.trim().length > 0
    && post.addressState.trim().length > 0
    && post.addressStreet.trim().length > 0
    && post.addressZip.trim().length > 0
    && post.instagramUrl.trim().length > 0
    && post.latitude !== 0
    && post.longitude !== 0
    && post.neighborhood.trim().length > 0
    && post.restaurantName.trim().length > 0
    && post.cost > 0
    && reviews.length === 2;
}

export const getReviewScore = (reviews: ReadonlyArray<WireReview>): string => {
  if (reviews.length === 0) {
    return "?";
  }
  let score = 0;
  reviews.forEach(review => {
    score += review.ecRating + review.foodRating + review.vibesRating;
  });
  let strScore = (score / reviews.length).toString()
  if (score % reviews.length === 0) {
    strScore += ".0";
  }
  return strScore;
}

const getBackgroundUrl = (instagramUrl: string) => {
  const regex = /https\:\/\/www\.instagram\.com\/p\/.+\//i;
  return instagramUrl.match(regex) + "media/?size=m";
}

class PostInternal extends React.PureComponent<Post.Props, {}> {

  public render() {
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
