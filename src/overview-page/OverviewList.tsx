import * as React from "react";
import { WirePost } from "../data/WirePost";
import { Post } from "./Post";

export namespace OverviewList {

  export interface OwnProps {
    posts: ReadonlyArray<WirePost>;
    handleNeighborhoodSelect: (neighborhood: string) => void;
  }

  export type Props = OwnProps;

}

export class OverviewList extends React.PureComponent<OverviewList.Props, {}> {

  public render() {
    return (
      <div className="post-list">
        { this.props.posts.map((post: WirePost) => {
          return (
            <Post
              key={post.id}
              postId={post.id!}
              onAddLocationFilter={this.props.handleNeighborhoodSelect}
            />);
        })}
        <div className="post -dummy" />
        <div className="post -dummy" />
        <div className="post -dummy" />
        <div className="post -dummy" />
      </div>
    );
  }
}
