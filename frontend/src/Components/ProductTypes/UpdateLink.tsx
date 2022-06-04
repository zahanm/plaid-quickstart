import { Button } from "plaid-threads";
import React, { useContext } from "react";

import Context from "../../Context";

import ProductTypesContainer from "./ProductTypesContainer";
import styles from "./index.module.scss";

const UpdateLink = () => {
  const { accessToken } = useContext(Context);
  async function launchUpdateMode() {
    console.log(accessToken);
  }
  return (
    <>
      <ProductTypesContainer productType="Update Item">
        <p>If your credentials are expired, you can refresh them here.</p>
        <Button
          className={styles.updateButton}
          onClick={() => launchUpdateMode()}
        >
          Launch Update
        </Button>
      </ProductTypesContainer>
    </>
  );
};

UpdateLink.displayName = "UpdateLink";

export default UpdateLink;
