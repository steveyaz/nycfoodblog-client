import { Button } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { EC_RATINGS, FOOD_RATINGS, VIBES_RATINGS } from "../constants";
import { RequestClient } from "../data/RequestClient";
import { WireReview } from "../data/WireReview";
import { SelectionFormField } from "../form/SelectionFormField";
import { TextAreaFormField } from "../form/TextAreaFormField";
import { setReview, setView } from "../redux/action";
import { AppState, VIEW_TYPE } from "../redux/state";

export namespace ReviewForm {

  export interface OwnProps {
    postId: number;
  }

  export interface StoreProps {
    authedUsername?: string;
    reviewMap: { [postId: number]: Array<WireReview> };
    setView: (viewType: VIEW_TYPE) => void;
    setReview: (review: WireReview) => void;
  }

  export type Props = OwnProps & StoreProps;

}

class ReviewFormInternal extends React.PureComponent<ReviewForm.Props, WireReview> {
  constructor(props: ReviewForm.Props){
    super(props);
    let review;
    if (props.reviewMap[props.postId] !== undefined) {
      for (const storedReview of props.reviewMap[props.postId]) {
        if (storedReview.username === props.authedUsername) {
          review = storedReview;
        }
      }
    }
    this.state = review || {
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
    RequestClient.getInstance().createReview(this.state);
    this.props.setReview(this.state);
    this.props.setView("ALL_POSTS");
    event.preventDefault();
  }

  private handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.setView("ALL_POSTS");
    event.preventDefault();
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    authedUsername: state.authedUsername,
    reviewMap: state.reviewMap,
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setView: (viewType: VIEW_TYPE) => dispatch(setView(viewType)),
    setReview: (review: WireReview) => dispatch(setReview(review)),
  };
};

export const ReviewForm = connect(mapStateToProps, mapDispatchToProps)(ReviewFormInternal);
