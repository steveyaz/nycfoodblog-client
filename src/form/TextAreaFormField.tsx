import { Intent, TextArea } from "@blueprintjs/core";
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

  public render() {
    return (
      <FormFieldWrapper label={this.props.label}>
        <TextArea
          className="text-area-field"
          intent={Intent.PRIMARY}
          onChange={this.handleTextChange}
          value={this.props.value}
        />
      </FormFieldWrapper>
    );
  }

  private handleTextChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    this.props.onValueChange(this.props.id, event.currentTarget.value);
    event.preventDefault();
  }

}