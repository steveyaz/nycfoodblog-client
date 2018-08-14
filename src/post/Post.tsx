import { Button } from '@blueprintjs/core';
import * as moment from 'moment';
import * as React from 'react';
import { NEIGHBORHOODS } from '../constants';
import { WirePost } from '../data/WirePost';
import { WireReview } from '../data/WireReview';
import './Post.css';

export namespace Post {

  export interface Props {
    post: WirePost;
    reviews?: Array<WireReview>;
    authedUsername?: string;
    viewEditPost: (postId: number) => void;
    viewAddOrEditReview: (postId: number) => void;
  }

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

export class Post extends React.PureComponent<Post.Props, Post.State> {
  public state: Post.State = INITIAL_STATE;

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
            <Button text="Edit Post" icon="edit" onClick={this.props.viewEditPost.bind(this, this.props.post.id)} />
          }
          { (this.props.authedUsername !== undefined) && ((this.props.reviews === undefined) || (this.props.reviews.filter(review => review.username === this.props.authedUsername).length === 0)) &&
            <Button text="Add Review" icon="plus" onClick={this.handleAddOrEditReview.bind(this, this.props.post.id)} />
          }
          { (this.props.authedUsername !== undefined) && (this.props.reviews !== undefined) && (this.props.reviews.filter(review => review.username === this.props.authedUsername).length > 0) &&
            <Button text="Edit Review" icon="edit" onClick={this.handleAddOrEditReview.bind(this, this.props.post.id)} />
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

  public handleAddOrEditReview = (postId: number) => {
    this.props.viewAddOrEditReview(postId);
  }

  public handleCollapsedToggle = () => {
    this.setState({ collapsed: !this.state.collapsed })
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
