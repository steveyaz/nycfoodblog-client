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
      <form onSubmit={this.handleSubmit}>
        <input type="submit" value="Logout" />
      </form>
    );
  }

  private handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    this.props.onSubmit();
    event.preventDefault();
  }
}
