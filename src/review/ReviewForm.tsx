import { Button } from "@blueprintjs/core";
import * as React from "react";
import { EC_RATINGS, FOOD_RATINGS, VIBES_RATINGS } from "../constants";
import { WireReview } from "../data/WireReview";
import { SelectionFormField } from "../form/SelectionFormField";
import { TextAreaFormField } from "../form/TextAreaFormField";

export namespace ReviewForm {

  export interface Props {
    username: string;
    postId: number;
    previousReview: WireReview | undefined;
    createReview: (post: WireReview) => void,
    closeForm: () => void,
  }

}

export class ReviewForm extends React.PureComponent<ReviewForm.Props, WireReview> {
  constructor(props: ReviewForm.Props){
    super(props);
    this.state = props.previousReview || {
      username: props.username,
      postId: props.postId,
      foodRating: 0,
      vibesRating: 0,
      ecRating: 0,
      text: "",
    };
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  public render() {
    return (
      <div className="review-form">
        <SelectionFormField id="foodRating" label="Food Rating" value={this.state.foodRating.toString()} selectionOptions={FOOD_RATINGS} onValueChange={this.handleValueChange} />
        <SelectionFormField id="vibesRating" label="Vibes Rating" value={this.state.vibesRating.toString()} selectionOptions={VIBES_RATINGS} onValueChange={this.handleValueChange} />
        <SelectionFormField id="ecRating" label="Extra Credit" value={this.state.ecRating.toString()} selectionOptions={EC_RATINGS} onValueChange={this.handleValueChange} />
        <TextAreaFormField id="text" label="Review Text" value={this.state.text} onValueChange={this.handleValueChange} />
        <div className="review-form-buttons">
          <Button className="post-form-submit" icon="endorsed" text="Submit" onClick={this.handleSubmit} />
          <Button text="Cancel" onClick={this.handleCancel} />
        </div>
      </div>
    );
  }

  private handleValueChange(id: string, value: any) {
    const newState = {};
    newState[id] = value;
    this.setState(newState);
  }

  private handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.createReview(this.state);
    this.props.closeForm();
    event.preventDefault();
  }

  private handleCancel(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.closeForm();
    event.preventDefault();
  }
}
