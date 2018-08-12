import * as React from 'react';

export namespace FormFieldWrapper {

  export interface Props {
    label: string;
    className?: string;
  }

}

export class FormFieldWrapper extends React.PureComponent<FormFieldWrapper.Props> {

  public render() {
    const className = this.props.className || "";
    return (
      <div className={"form-field " + className}>
        <div className="form-field-label">{this.props.label}</div>
        <div className="form-field-input">{React.Children.only(this.props.children)}</div>
      </div>
    );
  }

}