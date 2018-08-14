import { InputGroup } from "@blueprintjs/core";
import * as React from 'react';
import { FormFieldWrapper } from './FormFieldWrapper';

export namespace CurrencyFormField {

  export interface Props {
    id: string;
    label: string;
    value: number;
    onValueChange: (id: string, value: number) => void;
  }

}

export class CurrencyFormField extends React.PureComponent<CurrencyFormField.Props> {

  public render() {
    return (
      <FormFieldWrapper label={this.props.label}>
        <InputGroup value={this.getDisplayedValue()} onChange={this.handleCurrencyChange} />
      </FormFieldWrapper>
    );
  }

  private handleCurrencyChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === undefined || event.currentTarget.value === "") {
      this.props.onValueChange(this.props.id, NaN);
    }

    const numberValue = Number.parseFloat(event.currentTarget.value);
    if (!Number.isNaN(numberValue)) {
      this.props.onValueChange(this.props.id, numberValue);
    }

    event.preventDefault();
  }

  private getDisplayedValue() {
    if (Number.isNaN(this.props.value)) {
      return "";
    } else {
      return this.props.value.toString();
    }
  }

}