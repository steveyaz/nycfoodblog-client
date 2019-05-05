import { Button } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RequestClient } from "../data/RequestClient";
import { WireReview } from "../data/WireReview";
import { SelectionFormField } from "../forms/SelectionFormField";
import { TextAreaFormField } from "../forms/TextAreaFormField";
import { setReview } from "../redux/action";
import { AppState } from "../redux/state";
import { EC_RATINGS, FOOD_RATINGS, VIBES_RATINGS } from "../static/constants";
import { ADMIN_VIEW_STATE } from "./AdminPage";

export namespace ReviewForm {

  export interface OwnProps {
    postId: number;
    setAdminView: (viewState: ADMIN_VIEW_STATE) => void;
  }

  export interface StoreProps {
    authedUsername?: string;
    review?: WireReview;
    setReview: (review: WireReview) => void;
  }

  export type Props = OwnProps & StoreProps;

}

class ReviewFormInternal extends React.PureComponent<ReviewForm.Props, WireReview> {
  constructor(props: ReviewForm.Props){
    super(props);
    this.state = props.review || {
      username: props.authedUsername!,
      postId: props.postId,
      foodRating: 0,
      vibesRating: 0,
      ecRating: 0,
      text: "",
    };
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

  private handleValueChange = (id: string, value: any) => {
    const newState = {};
    newState[id] = value;
    this.setState(newState);
  }

  private handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    const review = {
      username: this.state.username,
      postId: this.state.postId,
      foodRating: Number.parseInt(this.state.foodRating.toString()),
      vibesRating: Number.parseInt(this.state.vibesRating.toString()),
      ecRating: Number.parseInt(this.state.ecRating.toString()),
      text: this.state.text,
    };
    RequestClient.getInstance().createReview(review);
    this.props.setReview(review);
    this.props.setAdminView("ADMIN_OVERVIEW");
    event.preventDefault();
  }

  private handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.setAdminView("ADMIN_OVERVIEW");
    event.preventDefault();
  }
}

const mapStateToProps = (state: AppState, ownProps: ReviewForm.OwnProps) => {
  return {
    authedUsername: state.authedUsername,
    review: (state.reviewMap[ownProps.postId] !== undefined && state.authedUsername !== undefined)
      ? state.reviewMap[ownProps.postId].find(review => review.username === state.authedUsername)
      : undefined,
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setReview: (review: WireReview) => dispatch(setReview(review)),
  };
};

export const ReviewForm = connect(mapStateToProps, mapDispatchToProps)(ReviewFormInternal);
