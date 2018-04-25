import * as React from 'react';
import './App.css';

import { DataRequestor } from './data/DataRequestor';
import { WirePost } from './data/WirePost';
import { Post } from './post/Post';
import logo from './rosie.png';

export interface AppState {
  posts: WirePost[];
  inError: boolean;
  authToken: string;
}

class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props);
    this.state = { posts: [], inError: false, authToken: "" };
  }

  public componentDidMount() {
    DataRequestor.getAllPosts().then((posts: WirePost[]) => {
      this.setState({ posts, inError: false });
    }).catch(e => {
      this.setState({ posts: [], inError: true });
    });
    DataRequestor.checkAuthentication().then((isAuthed) => {
      const authToken = "blah";
      if (isAuthed) {
        this.setState({ authToken });
        console.log("SUCCESSFUL LOGIN");
      } else {
        console.log("FAILED LOGIN");
      }
    }).catch(e => {
      this.setState({ inError: true });
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
          <p>❤️ Sonya</p>
        </div>
      </div>
    );
  }
}

export default App;
