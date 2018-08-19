import { Icon, Overlay } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { NEIGHBORHOODS } from "../constants";
import { WirePost } from "../data/WirePost";
import { WireReview } from "../data/WireReview";
import { AppState } from "../redux/state";

export namespace PostDetails {

  export interface OwnProps {
    postId: number;
    isOpen: boolean;
    onDetailsClose: () => void;
  }

  export interface StoreProps {
    postMap: { [postId: number]: WirePost };
    reviewMap: { [postId: number]: Array<WireReview> };
  }

  export type Props = OwnProps & StoreProps;

}

const getEmbedUrl = (instagramUrl: string) => {
  const regex = /https\:\/\/www\.instagram\.com\/p\/.+\//i;
  return instagramUrl.match(regex) + "embed";
}

class PostDetailsInternal extends React.PureComponent<PostDetails.Props> {

  public render() {
    const post = this.props.postMap[this.props.postId];
    let sonyaReview: WireReview | undefined;
    let steveReview: WireReview | undefined;
    if (this.props.reviewMap[this.props.postId] !== undefined) {
      for (const review of this.props.reviewMap[this.props.postId]) {
        if (review.username.toLowerCase() === "sonya") {
          sonyaReview = review;
        } else if (review.username.toLowerCase() === "steve") {
          steveReview = review;
        }
      }
    }
    const iframestyles = { "frameborder": "0", "height": "254px", "width": "200px" }

    return (
      <Overlay
        isOpen={this.props.isOpen}
        onClose={this.props.onDetailsClose}
        autoFocus={false}
        enforceFocus={false}
        hasBackdrop={false}>
        { post !== undefined && 

          <div className="post-details">
            <div className="post-details-close"><Icon icon="cross" onClick={this.props.onDetailsClose} /></div>
            <div className="restaurant-section">
              <div className="details-restaurant-name">{post.restaurantName}</div>
              <div className="details-location">{NEIGHBORHOODS.get(post.neighborhood)}</div>
              <div className="details-address">{post.addressStreet}</div>
              <div className="details-address">{post.addressCity}, {post.addressState} {post.addressZip}</div>
              <div className="details-order">We ordered...</div>
              <div className="details-ordered-items">{ post.order.map(item => item + ", ") }Price: ${post.cost}</div>
            </div>
            <div className="reviews-section">
              <div className="review-title-row">
                <div className="review-title">Sonya</div>
                <div className="review-title-spacer" />
                <div className="review-title">Steve</div>
              </div>
              <div className="review-content-row">
                <div className="review-quote -left"><Icon className="review-quote-icon" icon="citation" />{sonyaReview && sonyaReview.text}</div>
                <div className="review-scores">
                  <div className="review-score-row">
                    <div className="review-score">{sonyaReview && sonyaReview.foodRating + sonyaReview.vibesRating + sonyaReview.ecRating}</div>
                    <div className="review-score-type">Overall</div>
                    <div className="review-score">{steveReview && steveReview.foodRating + steveReview.vibesRating + steveReview.ecRating}</div>
                  </div>
                  <div className="review-score-row">
                    <div className="review-score">{sonyaReview && sonyaReview.foodRating}</div>
                    <div className="review-score-type">Food</div>
                    <div className="review-score">{steveReview && steveReview.foodRating}</div>
                  </div>
                  <div className="review-score-row">
                    <div className="review-score">{sonyaReview && sonyaReview.vibesRating}</div>
                    <div className="review-score-type">Vibe</div>
                    <div className="review-score">{steveReview && steveReview.vibesRating}</div>
                  </div>
                  <div className="review-score-row">
                    <div className="review-score">{sonyaReview && sonyaReview.ecRating}</div>
                    <div className="review-score-type">EC</div>
                    <div className="review-score">{steveReview && steveReview.ecRating}</div>
                  </div>
                  <div className="post-score review-overall-score">{this.getReviewScore(sonyaReview, steveReview)}</div>
                </div>
                <div className="review-quote"><Icon className="review-quote-icon" icon="citation" />{steveReview && steveReview.text}</div>
              </div>
            </div>
            <div className="instagram-section">
              <iframe className="instagram-iframe" src={getEmbedUrl(post.instagramUrl)} {...iframestyles} />
            </div>
          </div>

        }
      </Overlay>
    );
  }

  private getReviewScore(sonyaReview: WireReview | undefined, steveReview: WireReview | undefined) {
    if (sonyaReview === undefined && steveReview === undefined) {
      return "?";
    }
    let score = 0;
    if (sonyaReview !== undefined) {
      score += sonyaReview.ecRating + sonyaReview.foodRating + sonyaReview.vibesRating;
    }
    if (steveReview !== undefined) {
      score += steveReview.ecRating + steveReview.foodRating + steveReview.vibesRating;
    }
    return score * 5; // score is out of 20
  }
  
}

const mapStateToProps = (state: AppState) => {
  return {
    postMap: state.postMap,
    reviewMap: state.reviewMap,
  };
}

export const PostDetails = connect(mapStateToProps)(PostDetailsInternal);
