import * as React from 'react';
import { WirePost } from '../data/WirePost';

export interface PostProps {
  post: WirePost;
}

export class Post extends React.PureComponent<PostProps> {
  public render() {
    return (
      <div className="post">
        <div>Restaurant Name: {this.props.post.restaurantName}</div>
      </div>
    );
  }
}
