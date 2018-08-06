import * as React from 'react';

export namespace FormFieldWrapper {

  export interface Props {
    label: string;
  }

}

export class FormFieldWrapper extends React.PureComponent<FormFieldWrapper.Props> {

  public render() {
    return (
      <div className="form-field">
        <div className="form-field-label">{this.props.label}</div>
        <div className="form-field-input">{React.Children.only(this.props.children)}</div>
      </div>
    );
  }

}