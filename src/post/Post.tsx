import * as moment from 'moment';
import * as React from 'react';
import { WirePost } from '../data/WirePost';
import { WireReview } from '../data/WireReview';
import { Review } from '../review/Review';
import './Post.css';
import { NEIGHBORHOODS } from './PostForm';

export interface PostProps {
  post: WirePost;
  reviews?: WireReview[];
  authedUsername?: string;
  viewAddOrEditPost: (postId: number) => void;
  viewAddOrEditReview: (postId: number) => void;
}

const getBackgroundUrl = (instagramUrl: string) => {
  const regex = /https\:\/\/www\.instagram\.com\/p\/.+\//i;
  return instagramUrl.match(regex) + "media/?size=l";
}

const getEmbedUrl = (instagramUrl: string) => {
  const regex = /https\:\/\/www\.instagram\.com\/p\/.+\//i;
  return instagramUrl.match(regex) + "embed";
}

export interface PostState {
  collapsed: boolean;
}

export class Post extends React.PureComponent<PostProps, PostState> {
  public constructor(props: any) {
    super(props);
    this.state = { collapsed: true };
    this.handleAddOrEditReview = this.handleAddOrEditReview.bind(this);
    this.handleCollapsedToggle = this.handleCollapsedToggle.bind(this);
  }

  public render() {
    const backgroundImage = this.props.post.instagramUrl ?
      { backgroundImage: "url('" + getBackgroundUrl(this.props.post.instagramUrl) + "')" }
      : {};
    return (
      <div className="post" style={backgroundImage}>
        <div className="restaurant-name">{this.props.post.restaurantName}</div>
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
          <div className="reviews">
            { (this.props.authedUsername !== undefined) &&
              <button onClick={this.props.viewAddOrEditPost.bind(this, this.props.post.id)}>Edit Post</button>
            }
            { (this.props.authedUsername !== undefined) && ((this.props.reviews === undefined) || (this.props.reviews.filter(review => review.username === this.props.authedUsername).length === 0)) &&
              <button onClick={this.handleAddOrEditReview}>Add Review</button>
            }
            { (this.props.reviews !== undefined) && this.props.reviews.filter(review => review.username === this.props.authedUsername).map(review => {
                return <Review key={review.postId + review.username} review={review} viewEditReview={this.handleAddOrEditReview} />
            })}
            { (this.props.reviews !== undefined) && this.props.reviews.filter(review => review.username !== this.props.authedUsername).map(review => {
                return <Review key={review.postId + review.username} review={review} />
            })}
          </div>
        </div>
        <div className={"post-expanded-details " + (this.state.collapsed ? "-collapsed" : "-not-collapsed")}>
          { this.props.post.instagramUrl &&
            <iframe className="instagram-iframe" src={getEmbedUrl(this.props.post.instagramUrl)} />
          }
        </div>
        <div className="collapsedToggle" onClick={this.handleCollapsedToggle}>{this.state.collapsed ? '\u25BC' : '\u25B2' }</div>
      </div>
    );
  }

  public handleAddOrEditReview() {
    this.props.viewAddOrEditReview(this.props.post.id!);
  }

  public handleCollapsedToggle() {
    this.setState({ collapsed: !this.state.collapsed })
  }
}
