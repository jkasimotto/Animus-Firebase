import React, { useContext, useState, useEffect } from "react";
import { Button } from "@mui/material";
import firebase from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../../auth/auth";
import { checkGoogleDriveTokensExist } from "../../services/firestore";
import MenuButton from "../MenuButton/MenuButton";

const functions = getFunctions();
const db = getFirestore();

const SyncDriveButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasTokens, setHasTokens] = useState(false);
  const { user } = useContext(AuthContext);


  useEffect(() => {
    const fetchUserTokens = async () => {
      if (user) {
        console.log("User logged in, fetching tokens.")
        setHasTokens(await checkGoogleDriveTokensExist(user.uid));
      }
    };

    fetchUserTokens();
  }, []);

  const syncDriveFolder = async () => {
    setLoading(true);
    setMessage("Syncing drive folder...");

    try {
      const syncDriveFolderFunction = httpsCallable(
        functions,
        "syncDriveFolder"
      );
      console.log("syncDriveFolderFunction", syncDriveFolderFunction);
      await syncDriveFolderFunction();
      setMessage("Drive folder synced successfully!");
    } catch (error) {
      if (error.message === 'Invalid token. The user must authenticate again.') {
        console.log("FUCK YOU")
        grantScopes();
      } else {
        setMessage("Error syncing drive folder: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const grantScopes = async () => {
    setLoading(true);
    setMessage("Requesting access...");

    const endpoint = process.env.REACT_APP_GENERATE_AUTH_URL;
    console.log("endpoint", endpoint);

    try {
      // wait 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          scopes: ["https://www.googleapis.com/auth/drive.readonly"],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const authorizationUrl = data.authorizationUrl;
        if (authorizationUrl) {
          window.location.href = authorizationUrl;
        } else {
          setMessage("Authorization URL not found!");
        }
      } else {
        setMessage("Error granting access: " + response.statusText);
      }
    } catch (error) {
      setMessage("Error granting access: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("hasTokens", hasTokens);

  return (
    <MenuButton
      variant="contained"
      color="primary"
      action={hasTokens ? syncDriveFolder : grantScopes}
      loading={loading}
      hasAction={true}
    >
      {hasTokens ? "Sync Drive Folder" : "Grant Scopes"}
    </MenuButton>
  );
};

export default SyncDriveButton;
