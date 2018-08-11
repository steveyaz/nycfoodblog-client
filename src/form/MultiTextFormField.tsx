import { TagInput } from "@blueprintjs/core";
import * as React from "react";
import { FormFieldWrapper } from "./FormFieldWrapper";

export namespace MultiTextFormField {

  export interface Props {
    id: string;
    label: string;
    value: Array<string>;
    onValueChange: (id: string, value: Array<string>) => void;
  }

}

export class MultiTextFormField extends React.PureComponent<MultiTextFormField.Props> {

  public constructor(props: MultiTextFormField.Props) {
    super(props);
    this.handleEntryChange = this.handleEntryChange.bind(this);
  }

  public render() {
    return (
      <FormFieldWrapper label={this.props.label}>
        <TagInput
          values={this.props.value.map(item => item)}
          onChange={this.handleEntryChange}
        />
      </FormFieldWrapper>
    );
  }

  private handleEntryChange(values: React.ReactNode[]) {
    const validValues = values.filter(value => value !== undefined && value != null);
    this.props.onValueChange(this.props.id, validValues.map(value => value!.toString()));
  }

}