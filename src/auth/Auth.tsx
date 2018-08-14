import { Button } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RequestClient } from "../data/RequestClient";
import { setAuthedUsername, setView } from "../redux/action";
import { AppState, VIEW_TYPE } from "../redux/state";
import "./Auth.css";
import { LoginForm } from "./LoginForm";

export namespace Auth {

  export interface StoreProps {
    authedUsername?: string;
    view: VIEW_TYPE;
    setAuthedUsername: (username: string | undefined) => void;
    setView: (viewType: VIEW_TYPE) => void;
  }

  export type Props = StoreProps;

}


class AuthInternal extends React.PureComponent<Auth.Props> {

  public render() {
    return (
      <div className="auth">
        {this.props.authedUsername !== undefined ?
          <div className="logged-in">
            <div className="user-greeting">Hello, {this.props.authedUsername}!</div>
            { this.props.view === "ALL_POSTS" && <Button text="Add Post" icon="add" onClick={this.handleAddPost} /> }
            <Button text="Logout" onClick={this.handleLogout} />
          </div> :
        <LoginForm onSubmit={this.handleLogin} />}
      </div>
    );
  }

  private handleAddPost = () => {
    this.props.setView("ADD_OR_EDIT_POST");
  }

  private handleLogin = (username: string, password: string) => {
    const that = this;
    RequestClient.getInstance().login(username, password).then(isAuthed => {
      if (isAuthed) {
        that.props.setAuthedUsername(username);
      }
    });
  }

  private handleLogout = () => {
    RequestClient.getInstance().logout();
    this.props.setAuthedUsername(undefined);
    this.props.setView("ALL_POSTS");
  }

}

const mapStateToProps = (state: AppState) => {
  return {
    authedUsername: state.authedUsername,
    view: state.view,
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setAuthedUsername: (username: string) => dispatch(setAuthedUsername(username)),
    setView: (viewType: VIEW_TYPE) => dispatch(setView(viewType)),
  };
};

export const Auth = connect(mapStateToProps, mapDispatchToProps)(AuthInternal);
