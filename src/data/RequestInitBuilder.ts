export class RequestInitBuilder {

  public static request(): RequestInitBuilder {
    return new RequestInitBuilder();
  }

  private requestInit: RequestInit;

  public constructor() {
    this.requestInit = 
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  }

  public withMethod(method: "GET" | "POST"): RequestInitBuilder {
    this.requestInit.method = method;
    return this;
  }

  public withBody(body: any): RequestInitBuilder {
    this.requestInit.body = JSON.stringify(body)
    return this;
  }

  public withAuth(token: string): RequestInitBuilder {
    if (!this.requestInit.headers) {
      this.requestInit.headers = {};
    }
    this.requestInit.headers["Authorization"] = "Basic " + token;
    return this;
  }

  public build(): RequestInit {
    return this.requestInit;
  }

}