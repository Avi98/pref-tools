import React from "react";

const credentials = {
  username: "admin",
  password: "admin",
};

export const Auth = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmit = (value) => {
    //create api to login
    console.log("", credentials);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>test My Ci</div>
      <input
        type="password"
        placeholder="Please enter password"
        value={password}
        onChange={setPassword}
      />
      <input
        placeholder="Please enter user name"
        value={username}
        onChange={setUsername}
      />
    </form>
  );
};
