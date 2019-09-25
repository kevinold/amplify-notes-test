import React, { useState, useEffect } from "react";
import Amplify, { graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import { Connect, withAuthenticator } from "aws-amplify-react"; // or 'aws-amplify-react-native';

import "./App.css";
import * as queries from "./graphql/queries";

Amplify.configure(awsconfig);

const ListView = ({ tasks }) => (
  <div>
    <h3>All Tasks</h3>
    <ul>
      {tasks.map(t => (
        <li key={t.id}>
          {t.title} ({t.id}) {t.groups}
        </li>
      ))}
    </ul>
  </div>
);

function App() {
  return (
    <div className="App">
      <Connect query={graphqlOperation(queries.listTasks)}>
        {({ data: { listTasks }, loading, error }) => {
          if (error) return <h3>Error</h3>;
          if (loading || !listTasks) return <h3>Loading...</h3>;
          return <ListView tasks={listTasks.items} />;
        }}
      </Connect>
    </div>
  );
}

export default withAuthenticator(App, true);
