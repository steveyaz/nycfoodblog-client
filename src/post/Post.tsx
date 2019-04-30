import { Button, Icon } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import { NEIGHBORHOODS } from "../constants";
import { WirePost } from "../data/WirePost";
import { WireReview } from "../data/WireReview";
import { setPost, setView } from "../redux/action";
import { AppState, VIEW_TYPE } from "../redux/state";

export namespace Post {

  export interface OwnProps {
    postId: number;
    setActivePost: (postId: number) => void;
    showDetails: (postId: number) => void;
    onAddLocationFilter: (neighborhood: string) => void;
  }

  export interface StoreProps {
    authedUsername?: string;
    usernames: Array<string>;
    setView: (viewType: VIEW_TYPE) => void;
    setPost: (post: WirePost) => void;
    postMap: { [postId: number]: WirePost };
    reviewMap: { [postId: number]: Array<WireReview> };
  }

  export type Props = OwnProps & StoreProps;

}

const getBackgroundUrl = (instagramUrl: string) => {
  const regex = /https\:\/\/www\.instagram\.com\/p\/.+\//i;
  return instagramUrl.match(regex) + "media/?size=m";
}

class PostInternal extends React.PureComponent<Post.Props, {}> {

  constructor(props: Post.Props) {
    super(props);
    this.handleEditPost = this.handleEditPost.bind(this);
    this.handleAddOrEditReview = this.handleAddOrEditReview.bind(this);
  }

  public render() {
    const post: WirePost = this.props.postMap[this.props.postId];
    const reviews: Array<WireReview> = this.props.reviewMap[this.props.postId];
    if (post === undefined) {
      return <div />;
    } else if (this.props.authedUsername === undefined
        && (post.instagramUrl.trim().length === 0 || reviews === undefined || reviews.length !== 2)) {
      return <div />;
    }
    const backgroundImage = post.instagramUrl ?
      { backgroundImage: "url('" + getBackgroundUrl(post.instagramUrl) + "')" }
      : {};
    return (
      <div className="post">
        <div className="post-score">{this.getReviewScore(reviews)}</div>
        <div className="post-image" onClick={this.handleShowDetails} style={backgroundImage} />
        <div className="post-below-image">
          <div className="post-description">
            <div className="restaurant-name" onClick={this.handleShowDetails}>{post.restaurantName}</div>
            <div className="location" onClick={this.onLocationClick}>{NEIGHBORHOODS.get(post.neighborhood)}</div>
          </div>
          <div className="post-tags">
            {post.tags && post.tags.map(tag => {
              return <div key={tag} className="tag">{tag}</div>
            })}
            <div className="post-expand">
              <Link to={`/post/${this.props.postId}`}><Icon className="post-expand-button" icon="share" /></Link>
            </div>
          </div>
          { (this.props.authedUsername !== undefined) &&
            <Button className="post-description-button" text="Edit Post" icon="edit" onClick={this.handleEditPost} />
          }
          { (this.props.authedUsername !== undefined) && ((reviews === undefined) || (reviews.filter(review => review.username === this.props.authedUsername).length === 0)) &&
            <Button className="post-description-button" text="Add Review" icon="plus" onClick={this.handleAddOrEditReview} />
          }
          { (this.props.authedUsername !== undefined) && (reviews !== undefined) && (reviews.filter(review => review.username === this.props.authedUsername).length > 0) &&
            <Button className="post-description-button" text="Edit Review" icon="edit" onClick={this.handleAddOrEditReview} />
          }
        </div>
      </div>
    );
  }

  private handleEditPost(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.setActivePost(this.props.postId);
    this.props.setView("ADD_OR_EDIT_POST");
    event.preventDefault();
  }

  private handleAddOrEditReview(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.setActivePost(this.props.postId);
    this.props.setView("ADD_OR_EDIT_REVIEW");
    event.preventDefault();
  }

  private handleShowDetails = () => {
    this.props.showDetails(this.props.postId);
  }

  private getReviewScore(reviews: Array<WireReview>) {
    if (reviews === undefined) {
      return "?";
    } else {
      let score = 0;
      for (const review of reviews) {
        score += review.ecRating + review.foodRating + review.vibesRating;
      }
      return score * 5; // score is out of 20
    }
  }

  private onLocationClick = () => {
    const post: WirePost = this.props.postMap[this.props.postId];
    this.props.onAddLocationFilter(post.neighborhood);
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    authedUsername: state.authedUsername,
    postMap: state.postMap,
    reviewMap: state.reviewMap,
    usernames: state.usernames,
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setView: (viewType: VIEW_TYPE) => dispatch(setView(viewType)),
    setPost: (post: WirePost) => dispatch(setPost(post)),
  };
};

export const Post = connect(mapStateToProps, mapDispatchToProps)(PostInternal);
