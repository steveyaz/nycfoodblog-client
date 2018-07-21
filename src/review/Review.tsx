import * as React from 'react';
import { WireReview } from '../data/WireReview';

export interface ReviewProps {
  review: WireReview;
  viewEditReview?: (review?: WireReview) => void;
}

export class Review extends React.PureComponent<ReviewProps> {
  public constructor(props: any) {
    super(props);
    this.editReview = this.editReview.bind(this);
  }

  public render() {
    return (
      <div className="review">
        {this.props.viewEditReview !== undefined &&
          <div onClick={this.editReview}>Click to Edit</div>
        }
        <div className="username">{this.props.review.username}</div>
        <div className="rating">{this.props.review.foodRating + this.props.review.vibesRating + this.props.review.ecRating}</div>
      </div>
    );
  }

  private editReview(event: React.MouseEvent<HTMLDivElement>) {
    this.props.viewEditReview!(this.props.review);
    event.preventDefault();
  }
}
