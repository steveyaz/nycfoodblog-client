import { Button, Icon } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { WirePost } from "../data/WirePost";
import { WireReview } from "../data/WireReview";
import { AppState } from "../redux/state";
import { ADMIN_VIEW_STATE } from "./AdminPage";

export namespace AdminOverview {

  export interface OwnProps {
    setAdminView: (viewState: ADMIN_VIEW_STATE) => void;
    setEditPostId: (editPostId: number) => void;
  }

  export interface StoreProps {
    authedUsername?: string;
    postMap: { [postId: number]: WirePost };
    reviewMap: { [postId: number]: ReadonlyArray<WireReview> };
  }

  export type Props = OwnProps & StoreProps;

}

class AdminOverviewInternal extends React.Component<AdminOverview.Props> {

  public render() {
    return (
      <div className="admin-overview">
        <Button className="admin-add-post-button" text="Add Post" icon="add" onClick={this.handleAddPost} />
        <div className="admin-overview-list">
          { Object.keys(this.props.postMap)
            .sort((a, b) => this.props.postMap[a].dateVisited > this.props.postMap[b].dateVisited ? -1 : 1)
            .map((postMapKey: string) => {
              return (
                this.renderPostRow(this.props.postMap[postMapKey], this.props.reviewMap[postMapKey] || [])
              )})}
        </div>
      </div>
    );
  }

  private renderPostRow = (post: WirePost, reviews: ReadonlyArray<WireReview>) => {
    // we assume 2 reviews only
    const isComplete = post.id !== undefined
      && post.addressCity.trim().length > 0
      && post.addressState.trim().length > 0
      && post.addressStreet.trim().length > 0
      && post.addressZip.trim().length > 0
      && post.instagramUrl.trim().length > 0
      && post.latitude !== 0
      && post.longitude !== 0
      && post.neighborhood.trim().length > 0
      && post.restaurantName.trim().length > 0
      && reviews.length === 2;
    let isReviewedByUser = false;
    reviews.forEach(review => {
      if (review.username === this.props.authedUsername) {
        isReviewedByUser = true;
      }
    });
    return (
      <div className="admin-overview-post-row" key={post.id}>
        <div className="admin-overview-post-grouping">
          { isComplete
            ? <Icon className="admin-overview-post-complete" icon="endorsed" iconSize={24} />
            : <Icon className="admin-overview-post-incomplete" icon="error" iconSize={24} />
          }
          <div className="admin-overview-post-name">{post.restaurantName}</div>
        </div>
        <div className="admin-overview-post-grouping">
          <Button className="admin-overview-row-button" text="Edit Post" icon="edit" id={post.id!.toString(10)} onClick={this.handleEditPost} />
          { isReviewedByUser 
            ? <Button className="admin-overview-row-button" text="Edit Review" icon="edit" id={post.id!.toString(10)} onClick={this.handleAddEditReview} />
            : <Button className="admin-overview-row-button" text="Add Review" icon="add" id={post.id!.toString(10)} onClick={this.handleAddEditReview} />}
        </div>
      </div>
    );
  }

  private handleAddPost = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.setAdminView("ADD_POST");
  }

  private handleEditPost = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.setEditPostId(parseInt(event.currentTarget.id, 10));
    this.props.setAdminView("EDIT_POST");
  }

  private handleAddEditReview = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.setEditPostId(parseInt(event.currentTarget.id, 10));
    this.props.setAdminView("ADD_EDIT_REVIEW");
  }

}

const mapStateToProps = (state: AppState) => {
  return {
    authedUsername: state.authedUsername,
    postMap: state.postMap,
    reviewMap: state.reviewMap,
  };
}

export const AdminOverview = connect(mapStateToProps)(AdminOverviewInternal);
