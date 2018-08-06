import * as moment from "moment";
import * as React from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { FormFieldWrapper } from "./FormFieldWrapper";

export namespace DateFormField {

  export interface Props {
    id: string;
    label: string;
    value: Date;
    onValueChange: (id: string, value: Date) => void;
  }

}

export class DateFormField extends React.PureComponent<DateFormField.Props> {

  public constructor(props: DateFormField.Props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  public render() {
    return (
      <FormFieldWrapper label={this.props.label}>
        <DatePicker
          selected={moment(this.props.value)}
          onChange={this.handleDateChange}
          showTimeSelect={true}
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="LLL"
        />
      </FormFieldWrapper>
    );
  }

  private handleDateChange(date: moment.Moment) {
    this.props.onValueChange(this.props.id, date.toDate());
  }

}