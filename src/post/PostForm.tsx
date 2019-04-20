import { Button } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { NEIGHBORHOODS } from "../constants";
import { RequestClient } from "../data/RequestClient";
import { WirePost } from "../data/WirePost";
import { CurrencyFormField } from "../form/CurrencyFormField";
import { DateFormField } from "../form/DateFormField";
import { FormFieldWrapper } from "../form/FormFieldWrapper";
import { MultiTextFormField } from "../form/MultiTextFormField";
import { SelectionFormField } from "../form/SelectionFormField";
import { TextFormField } from "../form/TextFormField";
import { setPost, setView } from "../redux/action";
import { AppState, VIEW_TYPE } from "../redux/state";

export namespace PostForm {

  export interface OwnProps {
    postId?: number;
  }

  export interface StoreProps {
    postMap: { [postId: number]: WirePost };
    setView: (viewType: VIEW_TYPE) => void;
    setPost: (post: WirePost) => void;
  }

  export type Props = OwnProps & StoreProps;

}

const NEW_POST: WirePost = {
  restaurantName: "",
  dateVisited: new Date(),
  neighborhood: "upperWestSide",
  addressStreet: "",
  addressCity: "New York",
  addressState: "NY",
  addressZip: "",
  lat: 0,
  long: 0,
  instagramUrl: "",
  order: [],
  cost: 0,
  tags: [],
}

class PostFormInternal extends React.PureComponent<PostForm.Props, WirePost> {
  public constructor(props: PostForm.Props) {
    super(props);
    const post = props.postId !== undefined ? props.postMap[props.postId] : undefined;
    this.state = post || NEW_POST;
  }

  public render() {
    return (
      <div className="post-form">
        <TextFormField id="restaurantName" label="Restaurant Name" value={this.state.restaurantName} onValueChange={this.handleValueChange} />
        <DateFormField id="dateVisited" label="Date Visited" value={this.state.dateVisited} onValueChange={this.handleValueChange} />
        <SelectionFormField id="neighborhood" label="Neighborhood" value={this.state.neighborhood} selectionOptions={NEIGHBORHOODS} onValueChange={this.handleValueChange} />
        <TextFormField id="addressStreet" label="Street" value={this.state.addressStreet} onValueChange={this.handleValueChange} />
        <TextFormField id="addressCity" label="City" value={this.state.addressCity} onValueChange={this.handleValueChange} />
        <TextFormField id="addressState" label="State" value={this.state.addressState} onValueChange={this.handleValueChange} />
        <TextFormField id="addressZip" label="Zip" value={this.state.addressZip} onValueChange={this.handleValueChange} />
        <FormFieldWrapper label="Lat/Long">
          <div className="lat-long-form-field">
            <Button text="Check" onClick={this.checkLatLong} />
            <div className="lat-long">[ {this.state.lat}, {this.state.long} ]</div>
          </div>
        </FormFieldWrapper>
        <TextFormField id="instagramUrl" label="Instagram URL" value={this.state.instagramUrl} onValueChange={this.handleValueChange} />
        <CurrencyFormField id="cost" label="Bill Total $" value={this.state.cost} onValueChange={this.handleValueChange} />
        <MultiTextFormField id="order" label="Order" value={this.state.order} onValueChange={this.handleValueChange} />
        <MultiTextFormField id="tags" label="Tags" value={this.state.tags} onValueChange={this.handleValueChange} />
        <div className="post-form-buttons">
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
    RequestClient.getInstance().createPost(this.state);
    this.props.setPost(this.state);
    this.props.setView("ALL_POSTS");
    event.preventDefault();
  }

  private handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.setView("ALL_POSTS");
    event.preventDefault();
  }

  private checkLatLong = () => {
    if (this.state.addressStreet !== ""
        && this.state.addressCity !== ""
        && this.state.addressState !== ""
        && this.state.addressZip !== "") {
          const address = this.state.addressStreet.split(" ").join("+")
              + ",+" + this.state.addressCity.split(" ").join("+")
              + ",+" + this.state.addressState
              + ",+" + this.state.addressZip;
          const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyBF04CX1d5vxtXJK5tqnzP4xKP_zk2yLdM';
          const request = new Request(url);
          fetch(request)
            .then(response => {
              return response.json();
            }).then((results) => {
              const loc = results['results'][0]['geometry']['location'];
              this.setState({ lat: loc['lat'], long: loc['lng'] });
            }).catch(e => {
              return Promise.reject(e);
            });
        }
  }
  
}

const mapStateToProps = (state: AppState) => {
  return {
    postMap: state.postMap,
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setView: (viewType: VIEW_TYPE) => dispatch(setView(viewType)),
    setPost: (post: WirePost) => dispatch(setPost(post)),
  };
};

export const PostForm = connect(mapStateToProps, mapDispatchToProps)(PostFormInternal);
