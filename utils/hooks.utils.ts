import { useState } from "react";
import { getCookie } from "./cookies.utils";
import { useOnMount } from "./lifeCycle.utils";

export const useIsLoggedIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useOnMount(() => {
    setIsLoggedIn(!!getCookie("last_used_tenant_domain"));
  });
  return isLoggedIn;
};
export const useUserEmail = () => {
  const [userEmail, setUserEmail] = useState("");
  useOnMount(() => {
    setUserEmail(getCookie("email_address") ?? "");
  });
  return userEmail;
};
