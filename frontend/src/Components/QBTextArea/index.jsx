import { Textarea } from "@material-tailwind/react";

const QBTextArea = (props) => {
  return <Textarea color={props.color ? props.color : "yellow"} {...props} />;
};

export default QBTextArea;
