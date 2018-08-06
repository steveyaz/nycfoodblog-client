import * as React from "react";
import { FormFieldWrapper } from "./FormFieldWrapper";

export namespace TextAreaFormField {

  export interface Props {
    id: string;
    label: string;
    value: string;
    onValueChange: (id: string, value: string) => void;
  }

}

export class TextAreaFormField extends React.PureComponent<TextAreaFormField.Props> {

  public constructor(props: TextAreaFormField.Props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  public render() {
    return (
      <FormFieldWrapper label={this.props.label}>
        <textarea className="text-area-input" value={this.props.value} onChangeCapture={this.handleTextChange} />
      </FormFieldWrapper>
    );
  }

  private handleTextChange(event: React.FormEvent<HTMLTextAreaElement>) {
    this.props.onValueChange(this.props.id, event.currentTarget.value);
    event.preventDefault();
  }

}