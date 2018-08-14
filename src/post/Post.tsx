import { Button } from "@blueprintjs/core";
import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { NEIGHBORHOODS } from "../constants";
import { WirePost } from "../data/WirePost";
import { WireReview } from "../data/WireReview";
import { setActivePost, setView } from "../redux/action";
import { AppState, VIEW_TYPE } from "../redux/state";

export namespace Post {

  export interface OwnProps {
    post: WirePost;
    reviews?: Array<WireReview>;
  }

  export interface StoreProps {
    authedUsername?: string;
    setActivePost: (postId: number | undefined) => void;
    setView: (viewType: VIEW_TYPE) => void;
  }

  export type Props = OwnProps & StoreProps;

  export interface State {
    collapsed: boolean;
  }

}

const INITIAL_STATE = { collapsed: true };

const getBackgroundUrl = (instagramUrl: string) => {
  const regex = /https\:\/\/www\.instagram\.com\/p\/.+\//i;
  return instagramUrl.match(regex) + "media/?size=l";
}

const getEmbedUrl = (instagramUrl: string) => {
  const regex = /https\:\/\/www\.instagram\.com\/p\/.+\//i;
  return instagramUrl.match(regex) + "embed";
}

class PostInternal extends React.PureComponent<Post.Props, Post.State> {
  public state: Post.State = INITIAL_STATE;

  constructor(props: Post.Props) {
    super(props);
    this.handleEditPost = this.handleEditPost.bind(this);
    this.handleAddOrEditReview = this.handleAddOrEditReview.bind(this);
  }

  public render() {
    const backgroundImage = this.props.post.instagramUrl ?
      { backgroundImage: "url('" + getBackgroundUrl(this.props.post.instagramUrl) + "')" }
      : {};
    return (
      <div className="post" style={backgroundImage}>
        <div className="post-header">
          <div className="score">{this.getReviewScore()}</div>
          <div className="restaurant-name">{this.props.post.restaurantName}</div>
          { (this.props.authedUsername !== undefined) &&
            <Button className="post-header-button" text="Edit Post" icon="edit" onClick={this.handleEditPost} />
          }
          { (this.props.authedUsername !== undefined) && ((this.props.reviews === undefined) || (this.props.reviews.filter(review => review.username === this.props.authedUsername).length === 0)) &&
            <Button className="post-header-button" text="Add Review" icon="plus" onClick={this.handleAddOrEditReview} />
          }
          { (this.props.authedUsername !== undefined) && (this.props.reviews !== undefined) && (this.props.reviews.filter(review => review.username === this.props.authedUsername).length > 0) &&
            <Button className="post-header-button" text="Edit Review" icon="edit" onClick={this.handleAddOrEditReview} />
          }
        </div>
        <div className="post-details">
          <div className="restaurant-details">
            <div className="restaurant-subtitle">
              <div className="date-visited">{moment(this.props.post.dateVisited).format("MMM D, YYYY")}</div>
              <div className="tag">{NEIGHBORHOODS.get(this.props.post.neighborhood)}</div>
            </div>
            <div className="tags">
              {this.props.post.tags && this.props.post.tags.map(tag => {
                return <div key={tag} className="tag">{tag}</div>
              })}
            </div>
          </div>
        </div>
        <div className={"post-expanded-details " + (this.state.collapsed ? "-collapsed" : "-not-collapsed")}>
          { this.props.post.instagramUrl &&
            <iframe className={"instagram-iframe " + (this.state.collapsed ? "-collapsed" : "-not-collapsed")} src={getEmbedUrl(this.props.post.instagramUrl)} />
          }
          <div className={"review-texts " + (this.state.collapsed ? "-collapsed" : "-not-collapsed")}>
            {this.props.reviews && this.props.reviews.map(review => {
              return <div key={review.postId + ":" + review.username}>{review.username + ": " + review.text}</div>;
            })}
          </div>
        </div>
      </div>
    );
  }

  private handleEditPost(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.setActivePost(this.props.post.id);
    this.props.setView("ADD_OR_EDIT_POST");
    event.preventDefault();
  }

  private handleAddOrEditReview(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.setActivePost(this.props.post.id);
    this.props.setView("ADD_OR_EDIT_REVIEW");
    event.preventDefault();
  }

  private getReviewScore() {
    if (this.props.reviews === undefined) {
      return "?";
    } else {
      let score = 0;
      for (const review of this.props.reviews) {
        score += review.ecRating + review.foodRating + review.vibesRating;
      }
      return score * 5;
    }
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    authedUsername: state.authedUsername,
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setActivePost: (postId: number | undefined) => dispatch(setActivePost(postId)),
    setView: (viewType: VIEW_TYPE) => dispatch(setView(viewType)),
  };
};

export const Post = connect(mapStateToProps, mapDispatchToProps)(PostInternal);
