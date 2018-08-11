import { Button } from "@blueprintjs/core";
import * as React from "react";
import { NEIGHBORHOODS } from "../constants";
import { WirePost } from "../data/WirePost";
import { CurrencyFormField } from "../form/CurrencyFormField";
import { DateFormField } from "../form/DateFormField";
import { MultiTextFormField } from "../form/MultiTextFormField";
import { SelectionFormField } from "../form/SelectionFormField";
import { TextFormField } from "../form/TextFormField";

export namespace PostForm {

  export interface Props {
    previousPost: WirePost | undefined;
    createPost: (post: WirePost) => void,
    closeForm: () => void,
  }

}

const NEW_POST: WirePost = {
  restaurantName: "",
  dateVisited: new Date(),
  neighborhood: "upperWestSide",
  addressStreet: "",
  addressCity: "New York",
  addressState: "NY",
  addressZip: "",
  instagramUrl: "",
  order: [""],
  cost: 0,
  tags: [""],
}

export class PostForm extends React.PureComponent<PostForm.Props, WirePost> {
  public constructor(props: any) {
    super(props);
    this.state = props.previousPost || NEW_POST;
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
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

  private handleValueChange(id: string, value: any) {
    const newState = {};
    newState[id] = value;
    this.setState(newState);
  }

  private handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.createPost(this.state);
    this.props.closeForm();
    event.preventDefault();
  }

  private handleCancel(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.closeForm();
    event.preventDefault();
  }
  
}
