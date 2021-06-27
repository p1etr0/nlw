import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Button } from './Button';

export function ApresentationButton(){
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }


  return (
    <button onClick={openModal}>
      teste
      <Modal 
      isOpen={modalIsOpen}
      onRequestClose = {closeModal}
      ariaHideApp={false}
      >
        <button onClick={closeModal}>testee</button>

      </Modal>
    </button>
  )

}