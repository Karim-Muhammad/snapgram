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
      <span className="flex gap-2">
        <Loader /> Authenticating processing
      </span>
    );

  if (state === "is-creating-user") {
    buttonText = (
      <span className="flex gap-2">
        <Loader /> Creating an account
      </span>
    );
  }

  if (state === "is-signing-in") {
    buttonText = (
      <span className="flex gap-2">
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
