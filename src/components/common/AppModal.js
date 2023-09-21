import React, { useEffect } from 'react'

function AppModal(props) {
  let { isModalOpen, children, modalId } = props;

  useEffect(() => {
    if (!isModalOpen) {
      if (props.onClose) {
        props.onClose();
      }
    }
  }, [isModalOpen])

  return (
    <div
      className={`modal fade ${isModalOpen ? 'show' : ''}`}
      id={modalId}
      tabIndex="-1"
      style={{ display: isModalOpen ? 'block' : 'none' }}
      aria-labelledby={modalId}
      aria-hidden={!isModalOpen}
    >
      <div
        className={`modal-dialog modal-dialog-centered ${props.extraClasses}`}
      >
        <div className="modal-content modalContent">
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppModal