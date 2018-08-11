import { InputGroup } from "@blueprintjs/core";
import * as React from "react";
import { FormFieldWrapper } from "./FormFieldWrapper";

export namespace TextFormField {

  export interface Props {
    id: string;
    label: string;
    value: string;
    onValueChange: (id: string, value: string) => void;
  }

}

export class TextFormField extends React.PureComponent<TextFormField.Props> {

  public constructor(props: TextFormField.Props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  public render() {
    return (
      <FormFieldWrapper label={this.props.label}>
        <InputGroup value={this.props.value} onChange={this.handleTextChange} />
      </FormFieldWrapper>
    );
  }

  private handleTextChange(event: React.FormEvent<HTMLInputElement>) {
    this.props.onValueChange(this.props.id, event.currentTarget.value);
    event.preventDefault();
  }

}