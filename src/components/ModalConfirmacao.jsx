import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function ModalConfirmacao({ show, onConfirmar, onFechar }) {
  return (
    <Modal show={show} onHide={onFechar} centered>
      <Modal.Header closeButton>
        <Modal.Title>Deseja mesmo sair?</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Button variant="danger" className="me-2" onClick={onConfirmar}>
          Sim
        </Button>
        <Button variant="secondary" onClick={onFechar}>
          Não
        </Button>
      </Modal.Body>
    </Modal>
  );
}
