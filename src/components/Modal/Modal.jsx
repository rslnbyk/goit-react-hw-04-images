import { ModalDiv, ModalImg, ModalOverlay } from './Modal.styled';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

export const Modal = ({ imageLink, closeModal }) => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.keyCode === 27) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal]);

  return (
    <ModalOverlay onClick={() => closeModal()}>
      <ModalDiv>
        <ModalImg src={imageLink} alt="Fullsize" />
      </ModalDiv>
    </ModalOverlay>
  );
};

Modal.propTypes = {
  imageLink: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
