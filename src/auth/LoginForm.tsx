import { Button } from "@blueprintjs/core";
import * as React from "react";
import { PasswordFormField } from "../form/PasswordFormField";
import { TextFormField } from "../form/TextFormField";

export namespace LoginForm {

  export interface Props {
    onSubmit: (username: string, password: string) => void;
  }

  export interface State {
    username: string;
    password: string;
  }

}

const INITIAL_STATE = { username: "", password: "" };

export class LoginForm extends React.PureComponent<LoginForm.Props, LoginForm.State> {
  public state: LoginForm.State = INITIAL_STATE;

  public render() {
    return (
      <div className="login-form">
        <TextFormField className="login-form-field" id="username" label="Username" value={this.state.username} onValueChange={this.handleValueChange} />
        <PasswordFormField className="login-form-field" id="password" label="Password" value={this.state.password} onValueChange={this.handleValueChange} />
        <Button className="login-form-button" icon="log-in" text="Login" onClick={this.handleSubmit} />
      </div>
    );
  }

  private handleValueChange = (id: string, value: any) => {
    const newState = {};
    newState[id] = value;
    this.setState(newState);
  }

  private handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.onSubmit(this.state.username, this.state.password);
    event.preventDefault();
    this.setState(INITIAL_STATE);
  }
}
