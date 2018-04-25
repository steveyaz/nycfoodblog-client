import { WirePost } from "./WirePost";

const baseUrl = 'http://localhost:8090';
const getRequest = {
  method: 'GET',
  headers: {
    "Content-Type": "application/json",
    // "Authorization": "Basic <base 64 encoded username:password>"
 },
};
const authRequest = {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ "username": "steve", "password": "mypassword" })
};

export class DataRequestor {

  public static checkAuthentication(): Promise<boolean> {
    const request = new Request(baseUrl + '/auth', authRequest);
    return fetch(request).then(response => {
      return response.json();
    }).then((isAuthed: boolean) => {
      return isAuthed;
    }).catch(e => {
      return Promise.reject(e);
    });
  }
  
  public static getAllPosts(): Promise<WirePost[]> {
    const request = new Request(baseUrl + '/post/all', getRequest);
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

  public static getPost(id: number): Promise<WirePost> {
    const request = new Request(baseUrl + '/post/' + id, getRequest);
    return fetch(request).then(response => {
      return response.json();
    }).then((post: WirePost) => {
      return post;
    }).catch(e => {
      return Promise.reject(e);
    });
  }

}
