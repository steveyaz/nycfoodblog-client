import * as React from 'react';
import './App.css';

import { LoginForm } from './auth/LoginForm';
import { LogoutForm } from './auth/LogoutForm';
import { RequestClient } from './data/RequestClient';
import { WirePost } from './data/WirePost';
import { Post } from './post/Post';
import logo from './rosie.png';

export interface AppState {
  posts: WirePost[];
  inError: boolean;
  username: string;
  isAuthed: boolean;
  displayAuth: boolean;
}

class App extends React.Component<any, AppState> {
  private requestClient: RequestClient;

  constructor(props: any) {
    super(props);
    this.state = { posts: [], inError: false, username: "", isAuthed: false, displayAuth: false };
    this.requestClient = new RequestClient();
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.toggleAuthDisplay = this.toggleAuthDisplay.bind(this);
  }

  public componentDidMount() {
    this.requestClient.getAllPosts().then((posts: WirePost[]) => {
      this.setState({ posts, inError: false });
    }).catch(e => {
      this.setState({ posts: [], inError: true });
    });
  }

  public render() {
    return (
      <div className="app">
        <header className="header">
          <img src={logo} className="logo" alt="Rosie!" />
          <h1 className="title">NYC Food Blog</h1>
        </header>
        <div className="content">
          <div className="posts">
            {this.state.posts.map((post: WirePost) => {
              return <Post key={post.id} post={post} />
            })}
          </div>
          { this.state.inError && <p>Error 😢</p> }
          <p onClick={this.toggleAuthDisplay}>❤️ Sonya</p>
        </div>
        {this.state.displayAuth && !this.state.isAuthed && <LoginForm onSubmit={this.onLogin} />}
        {this.state.displayAuth && this.state.isAuthed && <LogoutForm onSubmit={this.onLogout} />}
        {this.state.isAuthed && <div>Hello, {this.state.username}!</div>}
      </div>
    );
  }

  private toggleAuthDisplay() {
    this.setState({ displayAuth: !this.state.displayAuth });
  }

  private onLogin(username: string, password: string) {
    this.requestClient.login(username, password).then((isAuthed) => {
      if (isAuthed) {
        this.setState({ username, isAuthed });
      }
    }).catch(e => {
      this.setState({ inError: true });
    });
  }

  private onLogout() {
    this.requestClient.logout();
    this.setState({ username: "", isAuthed: false });
  }
}

export default App;
