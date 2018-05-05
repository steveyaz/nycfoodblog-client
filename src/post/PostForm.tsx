import * as moment from 'moment';
import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export interface PostFormState {
  restaurantName: string;
  dateVisited: moment.Moment;
  neighborhood: string;
  cuisineType: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  order: string[];
  cost: number;
  tags: string[];
}

export class PostForm extends React.PureComponent<any, PostFormState> {
  public constructor(props: any) {
    super(props);
    this.state =
    {
      restaurantName: "",
      dateVisited: moment(),
      neighborhood: "",
      cuisineType: "",
      addressStreet: "",
      addressCity: "New York",
      addressState: "NY",
      addressZip: "",
      order: [""],
      cost: 0.00,
      tags: [""]
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
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
          <select>
            <option value="upperWestSide">Upper West Side</option>
            <option value="brooklyn">Brooklyn</option>
            <option value="centralPark">Central Park</option>
            <option value="chelsea">Chelsea</option>
            <option value="chinatown">Chinatown</option>
            <option value="eastHarlem">East Harlem</option>
            <option value="eastVillage">East Village</option>
            <option value="financialDistrict">Financial District</option>
            <option value="garmentDistrict">Garment District</option>
            <option value="gramercy">Gramercy</option>
            <option value="greenwichVillage">Greenwich Village</option>
            <option value="harlem">Harlem</option>
            <option value="littleItaly">Little Italy</option>
            <option value="lowerEastSide">Lower East Side</option>
            <option value="midtownEast">Midtown East</option>
            <option value="midtownWest">Midtown West</option>
            <option value="morningsideHeights">Morningside Heights</option>
            <option value="murrayHill">Murray Hill</option>
            <option value="queens">Queens</option>
            <option value="soho">SoHo</option>
            <option value="stuyvesantTown">Stuyvesant Town</option>
            <option value="timesSquare">Times Square</option>
            <option value="tribeca">TriBeCa</option>
            <option value="upperEastSide">Upper East Side</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-field">
          <span>Cuisine Type</span>
          <input type="cuisineType" value={this.state.cuisineType} onChange={this.handleTextChange.bind(this, "cuisineType")} />
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

  private handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
