import * as React from 'react';
import './App.css';

import { Auth } from './auth/Auth';
import { RequestClient } from './data/RequestClient';
import { WirePost } from './data/WirePost';
import { Post } from './post/Post';
import { PostForm } from './post/PostForm';
import logo from './rosie.png';

export interface AppState {
  view: "ALL_POSTS" | "ADD_POST";
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
    this.state = { view: "ALL_POSTS", posts: [], inError: false, username: "", isAuthed: false, displayAuth: false };
    this.requestClient = new RequestClient();
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.toggleAuthDisplay = this.toggleAuthDisplay.bind(this);
    this.viewAddPost = this.viewAddPost.bind(this);
    this.createPost = this.createPost.bind(this);
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
          {this.state.displayAuth &&
            <Auth
              isAuthed={this.state.isAuthed}
              username={this.state.username}
              onLogin={this.onLogin}
              onLogout={this.onLogout}
            />}
          {this.state.isAuthed && 
            <div>
              <input type="submit" value="Add Post" onClick={this.viewAddPost} />
            </div>
          }
          <img src={logo} className="logo" alt="Rosie!" />
          <h1 className="title">NYC Food Blog</h1>
        </header>
        <div className="content">
          {this.state.view === "ALL_POSTS" &&
            <div>
              <div className="posts">
                {this.state.posts
                  .sort((a: WirePost, b: WirePost) => {
                    return a.dateVisited < b.dateVisited ? 1 : -1;
                  }).map((post: WirePost) => {
                    return <Post key={post.id!} post={post} />
                  })}
              </div>
              { this.state.inError && <p>Error 😢</p> }
              <div className="easterEgg" onClick={this.toggleAuthDisplay}>❤️ Sonya</div>
            </div>
          }
          {this.state.view === "ADD_POST" &&
            <PostForm createPost={this.createPost} />
          }
        </div>
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
    this.setState({ username: "", isAuthed: false, view: "ALL_POSTS" });
  }

  private viewAddPost() {
    this.setState({ view: "ADD_POST" });
  }

  private createPost(post: WirePost) {
    this.requestClient.createPost(post)
      .then(id => {
        post.id = id;
        this.setState({ posts: [post, ...this.state.posts], view: "ALL_POSTS" });
      }).catch(e => {
        this.setState({ inError: true });
      });
  }
}

export default App;
