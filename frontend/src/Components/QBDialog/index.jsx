import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";

const QBDialog = ({
  open,
  handleOpen,
  onOk,
  title,
  notifyIcon,
  notifySubject,
  notifyContent,
}) => {
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="gradient-border-solid bg-[rgba(0,0,0,0.2)]"
    >
      <DialogHeader>
        <Typography color="orange" variant="h5">
          {title}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="grid place-items-center gap-4">
        {notifyIcon}
        <Typography color="red" variant="h4">
          {notifySubject}
        </Typography>
        <Typography color="yellow" className="text-center font-normal">
          {notifyContent}
        </Typography>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="text" onClick={onOk} color="blue-gray">
          Ok, Got it
        </Button>
        <Button onClick={handleOpen} className="bg-custom-btn-clr">
          close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default QBDialog;
