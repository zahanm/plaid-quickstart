import { Button, ButtonToggle } from "plaid-threads";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { SelectGroupOptionsType } from "plaid-threads/SelectGroup";

import Context from "../../Context";

import ProductTypesContainer from "./ProductTypesContainer";
import styles from "./index.module.scss";

const UpdateLink = () => {
  const { dispatch, accessToken, linkToken } = useContext(Context);
  const [updateMode, setUpdateMode] = useState("credentials"); // 'accountSelection'

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
        body: `access_token=${accessToken}&account_selection_enabled=${
          updateMode === "accountSelection"
        }`,
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
  }, [dispatch, accessToken, updateMode]);

  const onSuccess = useCallback(
    (public_token: string) => {
      // No need to do the public_token exchange once again since the access_token will be unchanged
      dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
      window.history.pushState("", "", "/");
    },
    [dispatch]
  );

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess,
  };

  const { open } = usePlaidLink(config);

  const buttonOptions: Record<string, SelectGroupOptionsType> = {
    credentials: {
      label: "Expired Credentials",
      value: "credentials",
    },
    accountSelection: {
      label: "Account Selection",
      value: "accountSelection",
    },
  };

  return (
    <>
      <ProductTypesContainer productType="Update Item">
        <p>Select the reason to update this Item, and then launch Link.</p>
        <ButtonToggle
          className={styles.updateButton}
          value={buttonOptions[updateMode]}
          options={Object.values(buttonOptions)}
          onChange={(value) =>
            setUpdateMode(
              updateMode === "accountSelection"
                ? "credentials"
                : "accountSelection"
            )
          }
        />
        <Button className={styles.updateButton} onClick={() => open()}>
          Update Link
        </Button>
      </ProductTypesContainer>
    </>
  );
};

UpdateLink.displayName = "UpdateLink";

export default UpdateLink;
