import * as moment from 'moment';
import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { WirePost } from '../data/WirePost';

export interface PostFormProps {
  createPost: (post: WirePost) => void,
  closeForm: () => void,
}

export interface PostFormState {
  restaurantName: string;
  dateVisited: moment.Moment;
  neighborhood: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  instagramUrl: string;
  order: string[];
  cost: number;
  tags: string[];
}

export const NEIGHBORHOODS: Map<string, string> = new Map([
  ["upperWestSide", "Upper West Side"],
  ["brooklyn", "Brooklyn"],
  ["centralPark", "Central Park"],
  ["chelsea", "Chelsea"],
  ["chinatown", "Chinatown"],
  ["eastHarlem", "East Harlem"],
  ["eastVillage", "East Village"],
  ["financialDistrict", "Financial District"],
  ["garmentDistrict", "Garment District"],
  ["gramercy", "Gramercy"],
  ["greenwichVillage", "Greenwich Village"],
  ["harlem", "Harlem"],
  ["littleItaly", "Little Italy"],
  ["lowerEastSide", "Lower East Side"],
  ["midtownEast", "Midtown East"],
  ["midtownWest", "Midtown West"],
  ["morningsideHeights", "Morningside Heights"],
  ["murrayHill", "Murray Hill"],
  ["queens", "Queens"],
  ["soho", "SoHo"],
  ["stuyvesantTown", "Stuyvesant Town"],
  ["timesSquare", "Times Square"],
  ["tribeca", "TriBeCa"],
  ["upperEastSide", "Upper East Side"],
  ["other", "Other"],
]);

export class PostForm extends React.PureComponent<PostFormProps, PostFormState> {
  public constructor(props: any) {
    super(props);
    this.state =
    {
      restaurantName: "",
      dateVisited: moment(),
      neighborhood: "upperWestSide",
      addressStreet: "",
      addressCity: "New York",
      addressState: "NY",
      addressZip: "",
      instagramUrl: "",
      order: [""],
      cost: 0.00,
      tags: [""]
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleNeighborhoodChange = this.handleNeighborhoodChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  public render() {
    return (
      <form className="post-form" onSubmit={this.handleSubmit}>
        <div className="form-field">
          <span>Restaurant Name</span>
          <input type="text" value={this.state.restaurantName} onChange={this.handleTextChange.bind(this, "restaurantName")} />
        </div>
        <div className="form-field">
          <span>Date Visited</span>
          <DatePicker
            selected={this.state.dateVisited}
            onChange={this.handleDateChange}
            showTimeSelect={true}
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="LLL"
          />
        </div>
        <div className="form-field">
          <span>Neighborhood</span>
          <select value={this.state.neighborhood} onChange={this.handleNeighborhoodChange}>
            {Array.from(NEIGHBORHOODS.keys()).map(key => {
              return <option key={key} value={key}>{NEIGHBORHOODS.get(key)}</option>
            })}
          </select>
        </div>
        <div className="form-field">
          <span>Street Address</span>
          <input type="addressStreet" value={this.state.addressStreet} onChange={this.handleTextChange.bind(this, "addressStreet")} />
        </div>
        <div className="form-field">
          <span>City</span>
          <input type="addressCity" value={this.state.addressCity} onChange={this.handleTextChange.bind(this, "addressCity")} />
          <span>State</span>
          <input type="addressState" value={this.state.addressState} onChange={this.handleTextChange.bind(this, "addressState")} />
          <span>Zip</span>
          <input type="addressZip" value={this.state.addressZip} onChange={this.handleTextChange.bind(this, "addressZip")} />
        </div>
        <div className="form-field">
          <span>Instagram URL</span>
          <input type="instagramUrl" value={this.state.instagramUrl} onChange={this.handleTextChange.bind(this, "instagramUrl")} />
        </div>
        <div className="form-field">
          <span>Bill Total $</span>
          <input type="cost" value={this.state.cost} onChange={this.handleTextChange.bind(this, "cost")} />
        </div>
        <div className="form-field">
          <span>Order</span>
          <button onClick={this.addMultiTextEntry.bind(this, "order")}>+</button>
        </div>
        <div className="multi-field">
          {this.state.order.map((item, index) => {
            return (
              <div key={index}>
                <input type="order" value={item} onChange={this.handleMultiTextChange.bind(this, "order", index)} />
                <button onClick={this.removeMultiTextEntry.bind(this, "order", index)}>-</button>
              </div>
            )
          })}
        </div>
        <div className="form-field">
          <span>Tags</span>
          <button onClick={this.addMultiTextEntry.bind(this, "tags")}>+</button>
        </div>
        <div className="multi-field">
          {this.state.tags.map((item, index) => {
            return (
              <div key={index}>
                <input type="tags" value={item} onChange={this.handleMultiTextChange.bind(this, "tags", index)} />
                <button onClick={this.removeMultiTextEntry.bind(this, "tags", index)}>-</button>
              </div>
            )
          })}
        </div>
        <input type="submit" value="Submit" />
        <button onClick={this.handleCancel}>Cancel</button>
      </form>
    );
  }

  public textField(label: string, key: string) {
    return (
      <div className="form-field">
        <span>{label}</span>
        <input type="text" value={this.state[key]} onChange={this.handleTextChange.bind(this, key)} />
      </div>
    );
  }

  private handleDateChange(pickedDate: moment.Moment) {
    this.setState({
      dateVisited: pickedDate
    });
  }

  private handleTextChange(field: string, event: React.FormEvent<HTMLInputElement>) {
    const newState = {};
    newState[field] = event.currentTarget.value;
    this.setState(newState);
  }

  private handleMultiTextChange(field: string, index: number, event: React.FormEvent<HTMLInputElement>) {
    const newState = {};
    newState[field] = this.state[field];
    newState[field][index] = event.currentTarget.value;
    this.setState(newState);
    this.forceUpdate();
    event.preventDefault();
  }

  private handleNeighborhoodChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({neighborhood: event.currentTarget.value});
    event.preventDefault();
  }

  private handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const post: WirePost = {
      restaurantName: this.state.restaurantName,
      dateVisited: this.state.dateVisited.toDate(),
      neighborhood: this.state.neighborhood,
      addressStreet: this.state.addressStreet,
      addressCity: this.state.addressCity,
      addressState: this.state.addressState,
      addressZip: this.state.addressZip,
      instagramUrl: this.state.instagramUrl,
      order: this.state.order,
      cost: this.state.cost,
      tags: this.state.tags,
    }
    this.props.createPost(post);
    this.props.closeForm();
    event.preventDefault();
  }

  private handleCancel(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    this.props.closeForm();
  }

  private addMultiTextEntry(field: string, event: React.MouseEvent<HTMLButtonElement>) {
    const newState = {};
    newState[field] = this.state[field];
    newState[field].push("");
    this.setState(newState);
    this.forceUpdate();
    event.preventDefault();
  }

  private removeMultiTextEntry(field: string, index: number, event: React.MouseEvent<HTMLButtonElement>) {
    const newState = {};
    newState[field] = [];
    if (this.state[field].length === 1) {
      newState[field].push("");
    } else {
      this.state[field].forEach((entry: string, oldIndex: number) => {
        if (index !== oldIndex) {
          newState[field].push(entry);
        }
      })
    }
    this.setState(newState);
    this.forceUpdate();
    event.preventDefault();
  }
}
