import * as React from 'react';
import { LoginForm } from './LoginForm';
import { LogoutForm } from './LogoutForm';

export interface AuthProps {
  isAuthed: boolean;
  username: string;
  onLogin: (username: string, password: string) => void;
  onLogout: () => void;
}

export class Auth extends React.PureComponent<AuthProps> {

  public render() {
    if (this.props.isAuthed) {
      return (
        <div>
          <span>Hello, {this.props.username}!</span>
          <LogoutForm onSubmit={this.props.onLogout} />
        </div>
      );
    } else {
      return <LoginForm onSubmit={this.props.onLogin} />
    }
  }

}
