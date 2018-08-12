import { Button } from '@blueprintjs/core';
import * as React from 'react';
import './Auth.css';
import { LoginForm } from './LoginForm';

export interface AuthProps {
  isAuthed: boolean;
  username?: string;
  onLogin: (username: string, password: string) => void;
  onLogout: () => void;
  onAddPost: () => void;
}

export class Auth extends React.PureComponent<AuthProps> {

  public render() {
    return (
      <div className="auth">
        {this.props.isAuthed ?
          <div className="logged-in">
            <div className="user-greeting">Hello, {this.props.username}!</div>
            <Button text="Add Post" icon="add" onClick={this.props.onAddPost} />
            <Button text="Logout" onClick={this.props.onLogout} />
          </div> :
        <LoginForm onSubmit={this.props.onLogin} />}
      </div>
    );
  }

}
