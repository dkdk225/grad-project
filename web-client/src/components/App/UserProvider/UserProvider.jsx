import { useState, createContext, useEffect } from "react";
import { getRequest } from "../../../requests";
import { useLocation } from "react-router-dom";
import { paths } from "../../../requests/paths";
const { client, api } = paths;
const UserContext = createContext();
const PassUserProvider = {};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const getUser = () => {
    if (user === null)
      getRequest(api.userInfo)
        .then((result) => {
          setUser(result.data);
        })
        .catch((err) => {
          if (err.status === 403) reset();
        });
  };
  const reset = () => {
    setUser(null);
  };
  useEffect(() => {
    getUser();
  });
  PassUserProvider.user = user;
  PassUserProvider.setUser = setUser;
  PassUserProvider.getUser = getUser;
  PassUserProvider.reset = reset;
  const provider = { user, setUser, getRequest, reset };
  return (
    <UserContext.Provider value={provider}>{children}</UserContext.Provider>
  );
};

export { UserContext, PassUserProvider, UserProvider };
