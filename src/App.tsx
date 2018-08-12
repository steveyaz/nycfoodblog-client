import * as React from 'react';
import './App.css';
import './form/FormField.css';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Auth } from './auth/Auth';
import { RequestClient } from './data/RequestClient';
import { WirePost } from './data/WirePost';
import { WireReview } from './data/WireReview';
import { Post } from './post/Post';
import { PostForm } from './post/PostForm';
import { ReviewForm } from './review/ReviewForm';
import logo from './rosie.png';

export interface AppState {
  view: "ALL_POSTS" | "ADD_OR_EDIT_POST" | "ADD_OR_EDIT_REVIEW";
  posts: WirePost[];
  reviewMap: { [postId: number]: WireReview[] };
  inError: boolean;
  usernames: string[];
  authedUsername?: string;
  displayAuth: boolean;
  activePostId?: number;
}

const EMPTY_STRING_ARRAY: string[] = [];
const EMPTY_POST_ARRAY: WirePost[] = [];
const EMPTY_MAP = {};

class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props);
    this.state = { view: "ALL_POSTS", posts: EMPTY_POST_ARRAY, reviewMap: EMPTY_MAP, inError: false, usernames: EMPTY_STRING_ARRAY, authedUsername: undefined, displayAuth: false };
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.toggleAuthDisplay = this.toggleAuthDisplay.bind(this);
    this.viewAddOrEditPost = this.viewAddOrEditPost.bind(this);
    this.viewAddOrEditReview = this.viewAddOrEditReview.bind(this);
    this.viewAllPosts = this.viewAllPosts.bind(this);
    this.createPost = this.createPost.bind(this);
    this.createReview = this.createReview.bind(this);
    this.getActivePost = this.getActivePost.bind(this);
    this.getActiveReview = this.getActiveReview.bind(this);
  }

  public componentDidMount() {
    this.retrieveAllData();
  }

  public render() {
    const store = createStore(this.reducer);
    return (
      <Provider store={store}>
        <div className="app">
          <header className="header">
            <img src={logo} className="logo" alt="Rosie!" onClick={this.viewAllPosts} />
            <h1 className="title">The NYC Food Blog</h1>
          </header>
          {this.state.displayAuth &&
            <Auth
              isAuthed={this.state.authedUsername !== undefined}
              username={this.state.authedUsername}
              onLogin={this.onLogin}
              onLogout={this.onLogout}
              onAddPost={this.viewAddOrEditPost.bind(this, undefined)}
            />}
          <div className="content">
            {this.state.view === "ALL_POSTS" &&
              <div>
                <div className="posts">
                  {this.state.posts
                    .sort((a: WirePost, b: WirePost) => {
                      return a.dateVisited < b.dateVisited ? 1 : -1;
                    }).map((post: WirePost) => {
                      return (
                        <Post
                          key={post.id!}
                          post={post}
                          reviews={this.state.reviewMap[post.id!]}
                          viewEditPost={this.viewAddOrEditPost}
                          viewAddOrEditReview={this.viewAddOrEditReview}
                          authedUsername={this.state.authedUsername}
                        />);
                    })}
                </div>
                { this.state.inError && <p>Error 😢</p> }
                <div className="easterEgg" onClick={this.toggleAuthDisplay}>❤️ Sonya</div>
              </div>
            }
            {this.state.view === "ADD_OR_EDIT_POST" &&
              <PostForm
                previousPost={this.getActivePost()}
                createPost={this.createPost}
                closeForm={this.viewAllPosts}
              />
            }
            {(this.state.view === "ADD_OR_EDIT_REVIEW") && (this.state.authedUsername !== undefined) &&
              <ReviewForm
                username={this.state.authedUsername}
                postId={this.state.activePostId!}
                previousReview={this.getActiveReview()}
                createReview={this.createReview}
                closeForm={this.viewAllPosts}
              />
            }
          </div>
        </div>
      </Provider>
    );
  }

  private retrieveAllData() {
    const usernamesPromise = RequestClient.getInstance().getAllUsernames();
    const postsPromise = RequestClient.getInstance().getAllPosts();
    Promise.all([postsPromise, usernamesPromise])
      .then(values => {
        const reviewPromises = [];
        this.setState({ posts: values[0], usernames: values[1], inError: false });
        for (const username of values[1]) {
          for (const post of values[0]) {
            reviewPromises.push(RequestClient.getInstance().getReview(username.toLowerCase(), post.id!));
          }
        }
        Promise.all(reviewPromises)
          .then(reviews => {
            const tempReviewMap: { [postId: number]: WireReview[] } = {};
            for (const review of reviews) {
              if (review === undefined) {
                // NOOP
              } else if (tempReviewMap[review.postId!] === undefined) {
                tempReviewMap[review.postId!] = [review];
              } else {
                tempReviewMap[review.postId!] = [review, ...tempReviewMap[review.postId!]]
              }
            }
            this.setState({reviewMap: tempReviewMap});
          });
      })
      .catch(e => {
        this.setState({ posts: EMPTY_POST_ARRAY, usernames: EMPTY_STRING_ARRAY, inError: true });
      });
  }

  private reducer() {
    return { 
      view: "ALL_POSTS",
      posts: EMPTY_POST_ARRAY,
      reviewMap: EMPTY_MAP,
      inError: false,
      usernames: EMPTY_STRING_ARRAY,
      authedUsername: undefined,
      displayAuth: false
    };
  }

  private toggleAuthDisplay() {
    this.setState({ displayAuth: !this.state.displayAuth });
  }

  private onLogin(username: string, password: string) {
    RequestClient.getInstance().login(username, password).then((isAuthed) => {
      if (isAuthed) {
        this.setState({ authedUsername: username });
      }
    }).catch(e => {
      this.setState({ inError: true });
    });
  }

  private onLogout() {
    RequestClient.getInstance().logout();
    this.setState({ authedUsername: undefined, view: "ALL_POSTS" });
  }

  private viewAddOrEditPost(postId: number | undefined) {
    this.setState({ view: "ADD_OR_EDIT_POST", activePostId: postId });
  }

  private viewAddOrEditReview(postId: number) {
    this.setState({ view: "ADD_OR_EDIT_REVIEW", activePostId: postId });
  }

  private viewAllPosts() {
    if (this.state.view === "ALL_POSTS") {
      location.reload(true);
    } else {
      this.setState({ view: "ALL_POSTS" });
    }
  }

  private createPost(post: WirePost) {
    RequestClient.getInstance().createPost(post)
      .then(id => {
        post.id = id;
        const filteredPosts = this.state.posts.filter(oldPost => oldPost.id !== post.id);
        this.setState({ posts: [post, ...filteredPosts], view: "ALL_POSTS" });
      }).catch(e => {
        this.setState({ inError: true });
      });
  }

  private createReview(review: WireReview) {
    RequestClient.getInstance().createReview(review)
      .then(() => {
        this.retrieveAllData();
        this.setState({ view: "ALL_POSTS" });
      }).catch(e => {
        this.setState({ inError: true });
      });
  }

  private getActiveReview() {
    if (this.state.activePostId === undefined || this.state.authedUsername === undefined || this.state.reviewMap[this.state.activePostId] === undefined) {
      return undefined;
    }
    return this.state.reviewMap[this.state.activePostId].find(review => review.username === this.state.authedUsername)
  }

  private getActivePost() {
    if (this.state.activePostId === undefined) {
      return undefined;
    }
    return this.state.posts.find(post => post.id === this.state.activePostId)
  }

}

export default App;
