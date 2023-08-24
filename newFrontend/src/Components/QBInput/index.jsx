import { Input } from "@material-tailwind/react";

const QBInput = (props) => {
  return <Input color={props.color ? props.color : "yellow"} {...props} />;
};

export default QBInput;
