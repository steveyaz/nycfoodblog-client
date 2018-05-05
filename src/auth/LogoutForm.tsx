import * as React from 'react';

export interface LogoutFormProps {
  onSubmit: () => void;
}

export class LogoutForm extends React.PureComponent<LogoutFormProps> {
  constructor(props: LogoutFormProps){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render() {
    return (
      <input type="submit" value="Logout" onClick={this.handleSubmit} />
    );
  }

  private handleSubmit(event: React.FormEvent<HTMLInputElement>) {
    this.props.onSubmit();
    event.preventDefault();
  }
}
