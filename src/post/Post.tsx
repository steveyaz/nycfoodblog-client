import * as moment from 'moment';
import * as React from 'react';
import { WirePost } from '../data/WirePost';
import { NEIGHBORHOODS } from './PostForm';

export interface PostProps {
  post: WirePost;
}

export class Post extends React.PureComponent<PostProps> {
  public render() {
    return (
      <div className="post">
        <div>Restaurant Name: {this.props.post.restaurantName}</div>
        <div>Date Visited: {moment(this.props.post.dateVisited).format("MMM D, YYYY")}</div>
        <div>Neighborhood: {NEIGHBORHOODS.get(this.props.post.neighborhood)}</div>
      </div>
    );
  }
}
