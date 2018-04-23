import { WirePost } from "./WirePost";

const baseUrl = 'https://nycfoodblog.net/api';
const getRequest = {
  method: 'GET',
  headers: { "Content-Type": "application/json" },
};

export class DataRequestor {
  
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
