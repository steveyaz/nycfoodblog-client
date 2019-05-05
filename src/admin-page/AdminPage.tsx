import * as React from "react";
import { AuthForm } from "./AuthForm";

export class AdminPage extends React.Component {

  public render() {
    return (
      <div className="admin-page">
        <AuthForm />
        ADMIN
      </div>
    );
  }

}
