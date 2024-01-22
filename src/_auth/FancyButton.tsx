import React from "react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";

const FancyButton = ({
  children,
  state,
}: {
  children: React.ReactNode;
  state: string;
}) => {
  let buttonText = <span>{children}</span>;

  if (state === "is-authenticating")
    buttonText = (
      <span>
        <Loader /> Authenticating processing
      </span>
    );

  if (state === "is-creating-user") {
    buttonText = (
      <span>
        <Loader /> Creating an account
      </span>
    );
  }

  if (state === "is-signing-in") {
    buttonText = (
      <span>
        <Loader /> Signing in
      </span>
    );
  }

  return (
    <Button type="submit" className="shad-button_primary">
      {buttonText}
    </Button>
  );
};

export default FancyButton;
