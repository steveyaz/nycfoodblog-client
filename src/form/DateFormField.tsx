import { DateTimePicker } from "@blueprintjs/datetime";
import * as React from "react";
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
        <DateTimePicker
          value={new Date(this.props.value)}
          onChange={this.handleDateChange}
        />
      </FormFieldWrapper>
    );
  }

  private handleDateChange(selectedDate: Date) {
    this.props.onValueChange(this.props.id, selectedDate);
  }

}