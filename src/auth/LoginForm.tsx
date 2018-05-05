import * as React from 'react';

export interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
}

export interface LoginFormState {
  username: string;
  password: string;
}

const INITIAL_STATE = { username: "", password: "" };

export class LoginForm extends React.PureComponent<LoginFormProps, LoginFormState> {
  constructor(props: LoginFormProps){
    super(props);
    this.state = INITIAL_STATE;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <span>
          <span>Username</span>
          <input type="text" value={this.state.username} onChange={this.handleChange.bind(this, "username")} />
        </span>
        <span>
          <span>Password</span>
          <input type="password" value={this.state.password} onChange={this.handleChange.bind(this, "password")} />
        </span>
        <input type="submit" value="Login" />
      </form>
    );
  }

  private handleChange(field: string, event: React.FormEvent<HTMLInputElement>) {
    const newState = {};
    newState[field] = event.currentTarget.value;
    this.setState(newState);
  }

  private handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    this.props.onSubmit(this.state.username, this.state.password);
    event.preventDefault();
    this.setState(INITIAL_STATE);
  }
}
