import { HTMLSelect } from "@blueprintjs/core";
import * as React from "react";
import { FormFieldWrapper } from "./FormFieldWrapper";

export namespace SelectionFormField {

  export interface Props {
    id: string;
    label: string;
    value: string;
    selectionOptions: Map<string, string>;
    onValueChange: (id: string, value: string) => void;
  }

}

export class SelectionFormField extends React.PureComponent<SelectionFormField.Props> {

  public render() {
    return (
      <FormFieldWrapper label={this.props.label}>
        <HTMLSelect value={this.props.value} onChange={this.handleSelectionChange}>
          {Array.from(this.props.selectionOptions.keys()).map(key => {
            return <option key={key} value={key}>{this.props.selectionOptions.get(key)}</option>
          })}
        </HTMLSelect>
      </FormFieldWrapper>
    );
  }

  private handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.onValueChange(this.props.id, event.currentTarget.value);
    event.preventDefault();
  }

}