import * as React from 'react';
import { WireReview } from "../data/WireReview";

export interface ReviewFormProps {
  username: string;
  postId: number;
  previousReview: WireReview | undefined;
  createReview: (post: WireReview) => void,
  closeForm: () => void,
}

export class ReviewForm extends React.PureComponent<ReviewFormProps, WireReview> {
  constructor(props: ReviewFormProps){
    super(props);
    this.state = props.previousReview || {
      username: props.username,
      postId: props.postId,
      foodRating: 0,
      vibesRating: 0,
      ecRating: 0,
      text: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  public render() {
    return (
      <div>
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
          <button onClick={this.handleCancel}>Cancel</button>
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
    this.props.createReview(this.state);
    event.preventDefault();
    this.props.closeForm();
  }

  private handleCancel(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    this.props.closeForm();
  }
}
