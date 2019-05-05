import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../redux/state";
import { AdminOverview } from "./AdminOverview";
import { AuthForm } from "./AuthForm";
import { PostForm } from "./PostForm";
import { ReviewForm } from "./ReviewForm";

export type ADMIN_VIEW_STATE = "ADMIN_OVERVIEW" | "ADD_POST" | "EDIT_POST" | "ADD_EDIT_REVIEW";

export namespace AdminPage {

  export interface StoreProps {
    authedUsername?: string;
  }

  export type Props = StoreProps;

  export interface State {
    viewState: ADMIN_VIEW_STATE;
    editPostId?: number;
  }

}

export class AdminPageInternal extends React.Component<AdminPage.Props, AdminPage.State> {
  public state: AdminPage.State = { viewState: "ADMIN_OVERVIEW" }

  public render() {
    return (
      <div className="admin-page">
        <AuthForm />
        {this.props.authedUsername === undefined ?
          <div>Log in to access the admin page</div> :
          this.renderContent()
        }
      </div>
    );
  }

  private renderContent = () => {
    if (this.state.viewState === "ADMIN_OVERVIEW") {
      return (
        <AdminOverview setAdminView={this.setAdminView} setEditPostId={this.setEditPostId} />
      );
    } else if (this.state.viewState === "ADD_POST") {
      return (
        <PostForm setAdminView={this.setAdminView} />
      );
    } else if (this.state.viewState === "EDIT_POST") {
      return (
        <PostForm postId={this.state.editPostId} setAdminView={this.setAdminView} />
      );
    } else if (this.state.viewState === "ADD_EDIT_REVIEW" && this.state.editPostId !== undefined) {
      return (
        <ReviewForm postId={this.state.editPostId} setAdminView={this.setAdminView} />
      );
    } else {
      return (
        <div>ERROR</div>
      );
    }
  }

  private setAdminView = (viewState: ADMIN_VIEW_STATE) => {
    this.setState({ viewState });
  }

  private setEditPostId = (editPostId: number) => {
    this.setState({ editPostId });
  }

}

const mapStateToProps = (state: AppState) => {
  return {
    authedUsername: state.authedUsername,
  };
}

export const AdminPage = connect(mapStateToProps)(AdminPageInternal);
