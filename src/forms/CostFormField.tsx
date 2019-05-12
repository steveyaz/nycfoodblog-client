import { HTMLSelect } from "@blueprintjs/core";
import * as React from 'react';
import { FormFieldWrapper } from './FormFieldWrapper';

export namespace CostFormField {

  export interface Props {
    id: string;
    label: string;
    value: number;
    onValueChange: (id: string, value: number) => void;
  }

}

export class CostFormField extends React.PureComponent<CostFormField.Props> {

  public render() {
    return (
      <FormFieldWrapper label={this.props.label}>
        <HTMLSelect onChange={this.handleCurrencyChange} value={this.props.value.toString()}>
          <option value="0">Select cost</option>
          <option value="1">$</option>
          <option value="2">$$</option>
          <option value="3">$$$</option>
          <option value="4">$$$$</option>
          <option value="5">$$$$$</option>
        </HTMLSelect>
      </FormFieldWrapper>
    );
  }

  private handleCurrencyChange = (event: React.FormEvent<HTMLSelectElement>) => {
    this.props.onValueChange(this.props.id, Number.parseInt(event.currentTarget.value));
    event.preventDefault();
  }

}