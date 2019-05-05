import { Button } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RequestClient } from "../data/RequestClient";
import { PasswordFormField } from "../forms/PasswordFormField";
import { TextFormField } from "../forms/TextFormField";
import { setAuthedUsername } from "../redux/action";
import { AppState } from "../redux/state";

export namespace AuthForm {

  export interface StoreProps {
    authedUsername?: string;
    setAuthedUsername: (username: string | undefined) => void;
  }

  export type Props = StoreProps;

  export interface State {
    username: string;
    password: string;
  }

}


class AuthFormInternal extends React.PureComponent<AuthForm.Props, AuthForm.State> {
  public state: AuthForm.State = { username: "", password: "" };

  public render() {
    return (
      <div className="auth-form">
        {this.props.authedUsername !== undefined ?
          <div className="auth-form-authenticated">
            <div className="auth-form-user-greeting">Hello, {this.props.authedUsername}!</div>
            <Button text="Logout" onClick={this.handleLogout} />
          </div> :
          <div className="auth-form-login">
            <TextFormField className="auth-form-login-field" id="username" label="Username" value={this.state.username} onValueChange={this.handleValueChange} />
            <PasswordFormField className="auth-form-login-field" id="password" label="Password" value={this.state.password} onValueChange={this.handleValueChange} />
            <Button className="auth-form-login-button" icon="log-in" text="Login" onClick={this.handleSubmit} />
          </div>
        }
      </div>
    );
  }

  private handleValueChange = (id: string, value: any) => {
    const newState = {};
    newState[id] = value;
    this.setState(newState);
  }

  private handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    RequestClient.getInstance().login(this.state.username, this.state.password).then(isAuthed => {
      if (isAuthed) {
        this.props.setAuthedUsername(this.state.username.toLowerCase());
      }
    });
    event.preventDefault();
  }

  private handleLogout = () => {
    RequestClient.getInstance().logout();
    this.props.setAuthedUsername(undefined);
  }

}

const mapStateToProps = (state: AppState) => {
  return {
    authedUsername: state.authedUsername,
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setAuthedUsername: (username: string) => dispatch(setAuthedUsername(username)),
  };
};

export const AuthForm = connect(mapStateToProps, mapDispatchToProps)(AuthFormInternal);
