import { RequestInitBuilder } from "./RequestInitBuilder";
import { WirePost } from "./WirePost";

const BASE_URL = 'http://localhost:8090';

export class RequestClient {

  private token: string;
  
  public getAllPosts(): Promise<WirePost[]> {
    
    const request = new Request(BASE_URL + '/post/all', RequestInitBuilder.request().withMethod("GET").withAuth(this.token).build());
    return fetch(request).then(response => {
      return response.json();
    }).then((ids: [number]) => {
      return Promise.all(ids.map((id: number) => {
        return this.getPost(id);
      }));
    }).catch(e => {
      return Promise.reject(e);
    });
  }

  public getPost(id: number): Promise<WirePost> {
    const request = new Request(BASE_URL + '/post/' + id, RequestInitBuilder.request().withMethod("GET").build());
    return fetch(request).then(response => {
      return response.json();
    }).then((post: WirePost) => {
      return post;
    }).catch(e => {
      return Promise.reject(e);
    });
  }

  public login(username: string, password: string): Promise<boolean> {
    const request = new Request(BASE_URL + '/auth', RequestInitBuilder.request().withMethod("POST").withBody({ username, password }).build());
    return fetch(request).then(response => {
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

}
