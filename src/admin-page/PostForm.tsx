import { Button } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RequestClient } from "../data/RequestClient";
import { WirePost } from "../data/WirePost";
import { CostFormField } from "../forms/CostFormField";
import { DateFormField } from "../forms/DateFormField";
import { FormFieldWrapper } from "../forms/FormFieldWrapper";
import { MultiTextFormField } from "../forms/MultiTextFormField";
import { SelectionFormField } from "../forms/SelectionFormField";
import { TextFormField } from "../forms/TextFormField";
import { setPost } from "../redux/action";
import { AppState } from "../redux/state";
import { NEIGHBORHOODS } from "../static/constants";
import { ADMIN_VIEW_STATE } from "./AdminPage";

export namespace PostForm {

  export interface OwnProps {
    postId?: number;
    setAdminView: (viewState: ADMIN_VIEW_STATE) => void;
  }

  export interface StoreProps {
    post?: WirePost;
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
  latitude: 0,
  longitude: 0,
  instagramUrl: "",
  order: [],
  cost: 0,
  tags: [],
}

class PostFormInternal extends React.PureComponent<PostForm.Props, WirePost> {
  public constructor(props: PostForm.Props) {
    super(props);
    this.state = props.post || NEW_POST;
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
            <div className="lat-long">[ {this.state.latitude}, {this.state.longitude} ]</div>
          </div>
        </FormFieldWrapper>
        <TextFormField id="instagramUrl" label="Instagram URL" value={this.state.instagramUrl} onValueChange={this.handleValueChange} />
        <CostFormField id="cost" label="Cost" value={this.state.cost} onValueChange={this.handleValueChange} />
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
    this.props.setAdminView("ADMIN_OVERVIEW");
    event.preventDefault();
  }

  private handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.setAdminView("ADMIN_OVERVIEW");
    event.preventDefault();
  }

  private checkLatLong = () => {
    RequestClient.getInstance().checkLatLong(this.state.addressStreet, this.state.addressCity, this.state.addressState, this.state.addressZip)
      .then(latLong => {
        this.setState({ latitude: latLong[0], longitude: latLong[1] });
      });
  }
  
}

const mapStateToProps = (state: AppState, ownProps: PostForm.OwnProps) => {
  return {
    post: ownProps.postId !== undefined ? state.postMap[ownProps.postId] : undefined,
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setPost: (post: WirePost) => dispatch(setPost(post)),
  };
};

export const PostForm = connect(mapStateToProps, mapDispatchToProps)(PostFormInternal);
