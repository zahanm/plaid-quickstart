import { Button } from "plaid-threads";
import React, { useCallback, useContext, useEffect } from "react";

import Context from "../../Context";

import ProductTypesContainer from "./ProductTypesContainer";
import styles from "./index.module.scss";
import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";

const UpdateLink = () => {
  const { dispatch, accessToken, linkToken } = useContext(Context);

  useEffect(() => {
    const generateToken = async () => {
      if (!accessToken) {
        // accessToken might not be updated by the first time this runs
        return;
      }
      const response = await fetch("/api/create_link_token_for_update", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: `access_token=${accessToken}`,
      });
      if (!response.ok) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } });
        return;
      }
      const data = await response.json();
      if (data) {
        if (data.error != null) {
          dispatch({
            type: "SET_STATE",
            state: {
              linkToken: null,
              linkTokenError: data.error,
            },
          });
          return;
        }
        dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
      }
      localStorage.setItem("link_token", data.link_token); //to use later for Oauth
    };
    generateToken();
  }, [dispatch, accessToken]);

  const onSuccess = useCallback(
    (public_token: string) => {
      // No need to do the public_token exchange once again since the access_token will be unchanged
      dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
      window.history.pushState("", "", "/");
    },
    [dispatch]
  );

  let isOauth = false;
  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess,
  };

  if (window.location.href.includes("?oauth_state_id=")) {
    // TODO: figure out how to delete this ts-ignore
    // @ts-ignore
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
    console.log("Returned from Oauth flow", isOauth);
  }

  const { open } = usePlaidLink(config);

  return (
    <>
      <ProductTypesContainer productType="Update Item">
        <p>If your credentials are expired, you can refresh them here.</p>
        <Button className={styles.updateButton} onClick={() => open()}>
          Update Credentials
        </Button>
        <p>
          Or if you need to select a different set of accounts for this login,
          that starts here.
        </p>
        <Button className={styles.updateButton} onClick={() => open()}>
          Update Accounts
        </Button>
      </ProductTypesContainer>
    </>
  );
};

UpdateLink.displayName = "UpdateLink";

export default UpdateLink;
