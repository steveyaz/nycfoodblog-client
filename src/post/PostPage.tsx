import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { NEIGHBORHOODS } from "../constants";
import { WirePost } from "../data/WirePost";
import { WireReview } from "../data/WireReview";
import { AppState } from "../redux/state";

export namespace PostPage {

  export interface OwnProps {
    postId: string;
  }

  export interface StoreProps {
    post: WirePost | undefined;
    reviews: Array<WireReview> | undefined;
  }

  export type Props = StoreProps;

}

class PostPageInternal extends React.PureComponent<PostPage.Props, {}> {

  constructor(props: PostPage.Props) {
    super(props);
  }

  public render() {
    const { post, reviews } = this.props;
    if (post === undefined || reviews === undefined) {
      return <div>BLAH</div>;
    }
    return (
      <div className="post">
        <div className="post-score">{this.getReviewScore(reviews)}</div>
        <div className="post-below-image">
          <div className="post-description">
            <div className="restaurant-name">{post.restaurantName}</div>
            <div className="location">{NEIGHBORHOODS.get(post.neighborhood)}</div>
          </div>
          <div className="post-tags">
            {post.tags && post.tags.map(tag => {
              return <div key={tag} className="tag">{tag}</div>
            })}
          </div>
        </div>
      </div>
    );
  }

  private getReviewScore(reviews: Array<WireReview>) {
    if (reviews === undefined) {
      return "?";
    } else {
      let score = 0;
      for (const review of reviews) {
        score += review.ecRating + review.foodRating + review.vibesRating;
      }
      return score * 5; // score is out of 20
    }
  }
}

const mapStateToProps = (state: AppState, routerProps: RouteComponentProps<PostPage.OwnProps>) => {
  const postId = parseInt(routerProps.match.params.postId, 10);
  return {
    post: state.postMap[postId],
    reviews: state.reviewMap[postId],
  };
}

export const PostPage = connect(mapStateToProps)(PostPageInternal);
