import * as React from 'react';
import { WireReview } from "../data/WireReview";

export interface ReviewFormProps {
  username: string;
  postId: number;
  createReview: (post: WireReview) => void,
}

export interface ReviewFormState {
  foodRating: number;
  vibesRating: number;
  ecRating: number;
  text: string;
}

const INITIAL_STATE = {
  foodRating: 0,
  vibesRating: 0,
  ecRating: 0,
  text: "",
};

export class ReviewForm extends React.PureComponent<ReviewFormProps, ReviewFormState> {
  constructor(props: ReviewFormProps){
    super(props);
    this.state = INITIAL_STATE;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render() {
    return (
      <div>
        <div>{this.props.username}</div>
        <div>{this.props.postId}</div>
        <form onSubmit={this.handleSubmit}>
          <span>
            <span>Food Rating</span>
            <input type="text" value={this.state.foodRating} onChange={this.handleChange.bind(this, "foodRating")} />
          </span>
          <span>
            <span>Vibes Rating</span>
            <input type="text" value={this.state.vibesRating} onChange={this.handleChange.bind(this, "vibesRating")} />
          </span>
          <span>
            <span>EC Rating</span>
            <input type="text" value={this.state.ecRating} onChange={this.handleChange.bind(this, "ecRating")} />
          </span>
          <span>
            <span>Review Text</span>
            <input type="text" value={this.state.text} onChange={this.handleChange.bind(this, "text")} />
          </span>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }

  private handleChange(field: string, event: React.FormEvent<HTMLInputElement>) {
    const newState = {};
    newState[field] = event.currentTarget.value;
    this.setState(newState);
  }

  private handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    this.props.createReview({
      username: this.props.username.toLocaleLowerCase(),
      postId: this.props.postId,
      foodRating: this.state.foodRating,
      vibesRating: this.state.vibesRating,
      ecRating: this.state.ecRating,
      text: this.state.text,
    });
    event.preventDefault();
    this.setState(INITIAL_STATE);
  }
}
