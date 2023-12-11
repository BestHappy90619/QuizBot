import { Button } from "@material-tailwind/react";

const QBButton = (props) => {
  return <Button {...props}>{props.children}</Button>;
};

export default QBButton;
