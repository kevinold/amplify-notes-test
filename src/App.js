import React, { useState, useEffect, useReducer } from "react";
import Amplify, { Auth, API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import { Connect, withAuthenticator } from "aws-amplify-react"; // or 'aws-amplify-react-native';

import "./App.css";
import * as queries from "./graphql/queries";

Amplify.configure(awsconfig);
/*Amplify.configure({
  API: {
    graphql_headers: async () => ({
      Authorization: (await Auth.currentSession()).getIdToken().getJwtToken()
    })
  },
  ...awsconfig
});*/

async function fetchTasks(dispatch) {
  console.log("in fetchTasks");
  try {
    const taskData = await API.graphql(
      graphqlOperation(queries.listTasks),
      {},
      "AMAZON_COGNITO_USER_POOLS"
    );
    dispatch({
      type: "fetchTasksSuccess",
      tasks: taskData.data.listTasks.items
    });
  } catch (err) {
    console.log("error fetching tasks...: ", err);
    dispatch({
      type: "fetchTasksError"
    });
  }
}

const initialState = {
  tasks: [],
  loading: true,
  error: false
};

function reducer(state, action) {
  switch (action.type) {
    case "fetchTasksSuccess":
      return {
        ...state,
        tasks: action.tasks,
        loading: false
      };
    case "fetchTasksError":
      return {
        ...state,
        loading: false,
        error: true
      };
    default:
      throw new Error();
  }
}

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
  const [tasksState, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    async function fetchData() {
      const token = (await Auth.currentSession()).getIdToken().getJwtToken();
      console.log("token", token);
      //const creds = await Auth.currentCredentials();
      //console.log("creds", creds);
      // Returns: NotAuthorizedException: Unauthenticated access is not supported for this identity pool.
      console.log("fetchTasks");
      await fetchTasks(dispatch);
      console.log("after fetchTasks");
    }
    fetchData();
  }, []);
  console.log("tasks: ", tasksState);
  if (!tasksState && !tasksState.tasks) return <h3>Loading...</h3>;
  return (
    <div className="App">
      {/*<ListView tasks={tasksState.tasks.items} />;*/}
    </div>
  );
}

export default withAuthenticator(App, true);
