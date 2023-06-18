import { Button, Modal } from "react-bootstrap";

interface Props {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  message: string;
}

export const ConfirmDelete = ({ show, setShow, onConfirm, message }: Props) => {
  const closePopup = () => {
    setShow(false);
  };
  return (
    <Modal
      size="sm"
      show={show}
      onHide={closePopup}
      aria-labelledby="example-modal-sizes-title-sm"
      centered
    >
      <Modal.Body className="text-center">{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closePopup}>
          Close
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
