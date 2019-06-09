import { RequestInitBuilder } from "./RequestInitBuilder";
import { WirePost } from "./WirePost";
import { WireReview } from "./WireReview";

// const BASE_URL = 'http://localhost:8090';
const BASE_URL = 'https://thenycfoodblog.com/api';

export class RequestClient {

  public static getInstance() {
    if (this.instance === null || this.instance === undefined) {
      this.instance = new RequestClient();
    }
    return this.instance;
  }

  private static instance: RequestClient;
  private token: string;

  private constructor() {}

  public getAllUsernames(): Promise<string[]> {
    const request = new Request(BASE_URL + '/user/all', RequestInitBuilder.request().withMethod("GET").build());
    return fetch(request)
      .then(response => {
        return response.json();
      }).then((usernames: string[]) => {
        return usernames;
      }).catch(e => {
        return Promise.reject(e);
      });
  }
  
  public getAllPosts(): Promise<{ [postId: number]: WirePost }> {
    const request = new Request(BASE_URL + '/post/all', RequestInitBuilder.request().withMethod("GET").build());
    return fetch(request)
      .then(response => {
        return response.json();
      }).then((posts: { [postId: number]: WirePost }) => {
        return posts;
      }).catch(e => {
        return Promise.reject(e);
      });
  }

  public createPost(post: WirePost): Promise<number> {
    const request = new Request(BASE_URL + '/post', RequestInitBuilder.request().withMethod("POST").withAuth(this.token).withBody(post).build());
    return fetch(request)
      .then(response => {
        return response.json();
      }).then((id: number) => {
        return id;
      }).catch(e => {
        return Promise.reject(e);
      });
  }

  public getAllReviews(): Promise<{ [postId: number]: ReadonlyArray<WireReview> }> {
    const request = new Request(BASE_URL + '/review/all', RequestInitBuilder.request().withMethod("GET").build());
    return fetch(request)
      .then(response => {
        return response.json();
      }).then((reviews: { [postId: number]: ReadonlyArray<WireReview> }) => {
        return reviews;
      }).catch(e => {
        return Promise.reject(e);
      });
  }

  public createReview(review: WireReview): Promise<void> {
    const request = new Request(BASE_URL + '/review', RequestInitBuilder.request().withMethod("POST").withAuth(this.token).withBody(review).build());
    return fetch(request)
      .then(() => {
        return;
      }).catch(e => {
        return Promise.reject(e);
      });
  }

  public login(username: string, password: string): Promise<boolean> {
    const request = new Request(BASE_URL + '/auth', RequestInitBuilder.request().withMethod("POST").withBody({ username, password }).build());
    return fetch(request)
      .then(response => {
        return response.json();
      }).then((isAuthed: boolean) => {
        if (isAuthed) {
          this.token = btoa(username + ":" + password);
        }
        return isAuthed;
      }).catch(e => {
        return Promise.reject(e);
      });
  }

  public logout() {
    this.token = "";
  }

  public checkLatLong(addressStreet: string, addressCity: string, addressState: string, addressZip: string): Promise<Array<number>> {
    if (addressStreet !== ""
        && addressCity !== ""
        && addressState !== ""
        && addressZip !== "") {
      const address = addressStreet.split(" ").join("+")
          + ",+" + addressCity.split(" ").join("+")
          + ",+" + addressState
          + ",+" + addressZip;
      const request = new Request(BASE_URL + '/geocode/' + address, RequestInitBuilder.request().withMethod("GET").withAuth(this.token).build());
      return fetch(request)
        .then(response => {
          return response.json();
        }).then((latLong: Array<number>) => {
          return latLong;
        }).catch(e => {
          return Promise.reject(e);
        });
    } else {
      return Promise.reject("missing required address components");
    }
  }

}
