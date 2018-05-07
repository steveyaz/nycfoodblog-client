import * as moment from 'moment';
import * as React from 'react';
import { WirePost } from '../data/WirePost';
import './Post.css';
import { NEIGHBORHOODS } from './PostForm';

export interface PostProps {
  post: WirePost;
}

export class Post extends React.PureComponent<PostProps> {
  public render() {
    return (
      <div className="post">
        <div className="restaurant-name">{this.props.post.restaurantName}</div>
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
    );
  }
}
