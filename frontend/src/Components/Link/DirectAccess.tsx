import { Button, TextInput } from "plaid-threads";
import React, { useContext, useState } from "react";
import Context from "../../Context";

import styles from "../Headers/index.module.scss";

const DirectAccess = () => {
  const [itemID, setItemID] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const { dispatch } = useContext(Context);

  // Adapted from Components/Link/index.tsx
  const setTokenOnServer = async (itemID: string, accessToken: string) => {
    // send access_token to server
    const setToken = async () => {
      const response = await fetch("/api/set_access_token_direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: `access_token=${accessToken}&item_id=${itemID}`,
      });
      if (!response.ok) {
        dispatch({
          type: "SET_STATE",
          state: {
            itemId: `no item_id retrieved`,
            accessToken: `no access_token retrieved`,
            isItemAccess: false,
          },
        });
        return;
      }
      const data = await response.json();
      dispatch({
        type: "SET_STATE",
        state: {
          itemId: data.item_id,
          accessToken: data.access_token,
          isItemAccess: true,
        },
      });
    };
    setToken();
    dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
    window.history.pushState("", "", "/");
  };

  return (
    <>
      <p className={styles.introPar}>
        If you already have an <code>access_token</code> and{" "}
        <code>item_id</code>, provide them here to check details of the Plaid
        connection, and inspect data returned.
      </p>
      <TextInput
        name="item_id"
        id="item_id"
        label="item_id"
        readOnly={false}
        value={itemID}
        onChange={(e) => setItemID(e.target.value)}
      />
      <TextInput
        name="access_token"
        id="access_token"
        label="access_token"
        readOnly={false}
        value={accessToken}
        onChange={(e) => {
          setAccessToken(e.target.value);
        }}
      />
      <Button
        type="submit"
        onClick={() => setTokenOnServer(itemID, accessToken)}
        className={styles.inspectButton}
      >
        Inspect
      </Button>
    </>
  );
};

DirectAccess.displayName = "DirectAccess";

export default DirectAccess;
