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
    this.handleAddEntry = this.handleAddEntry.bind(this);
  }

  public render() {
    return (
      <FormFieldWrapper label={this.props.label}>
        <div className="multi-field">
          <button onClick={this.handleAddEntry}>+</button>
          {this.props.value.map((item, index) => {
            return (
              <div key={index}>
                <input value={item} onChange={this.handleEntryChange.bind(this, index)} />
                <button onClick={this.handleRemoveEntry.bind(this, index)}>-</button>
              </div>
            )
          })}
        </div>
      </FormFieldWrapper>
    );
  }

  private handleEntryChange(index: number, event: React.FormEvent<HTMLInputElement>) {
    const newValue = [];
    let entryIndex = 0;
    for (const entry of this.props.value) {
      if (entryIndex === index) {
        newValue.push(event.currentTarget.value);
      } else {
        newValue.push(entry);
      }
      entryIndex += 1;
    }
    this.props.onValueChange(this.props.id, newValue);
    event.preventDefault();
  }

  private handleAddEntry(event: React.MouseEvent<HTMLButtonElement>) {
    const newValue = [];
    for (const entry of this.props.value) {
      newValue.push(entry);
    }
    newValue.push("");
    this.props.onValueChange(this.props.id, newValue);
    event.preventDefault();
  }

  private handleRemoveEntry(index: number, event: React.MouseEvent<HTMLButtonElement>) {
    const newValue = [];
    let entryIndex = 0;
    for (const entry of this.props.value) {
      if (entryIndex !== index) {
        newValue.push(entry);
      }
      entryIndex += 1;
    }
    this.props.onValueChange(this.props.id, newValue);
    event.preventDefault();
  }

}