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
  viewAddOrEditReview: (review: WireReview) => void;
}

export class Post extends React.PureComponent<PostProps> {
  public constructor(props: any) {
    super(props);
    this.addReview = this.addReview.bind(this);
  }

  public render() {
    return (
      <div className="post">
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
            { (this.props.authedUsername !== undefined) && ((this.props.reviews === undefined) || (this.props.reviews.filter(review => review.username === this.props.authedUsername).length === 0)) &&
              <button onClick={this.addReview}>Add Review</button>
            }
            { (this.props.reviews !== undefined) && this.props.reviews.filter(review => review.username === this.props.authedUsername).map(review => {
                return <Review key={review.postId + review.username} review={review} viewEditReview={this.props.viewAddOrEditReview} />
            })}
            { (this.props.reviews !== undefined) && this.props.reviews.filter(review => review.username !== this.props.authedUsername).map(review => {
                return <Review key={review.postId + review.username} review={review} />
            })}
          </div>
        </div>
      </div>
    );
  }

  public addReview() {
    this.props.viewAddOrEditReview({
      postId: this.props.post.id!,
      username: this.props.authedUsername!,
      foodRating: 0,
      vibesRating: 0,
      ecRating: 0,
      text: "",
    });
  }
}
