import * as React from "react";
import { WireReview } from "../data/WireReview";

export interface ReviewProps {
  review: WireReview;
}

export class Review extends React.PureComponent<ReviewProps> {

  public render() {
    return (
      <div className="review">
        <div className="username">{this.props.review.username}</div>
        <div className="rating">{this.props.review.foodRating + this.props.review.vibesRating + this.props.review.ecRating}</div>
      </div>
    );
  }
  
}
