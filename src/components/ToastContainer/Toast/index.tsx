import React, { useEffect } from "react";
import {
  FiAlertCircle,
  FiXCircle,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import useToast, { ToastMessage } from "../../../hooks/ToastContext";

import { Container } from "./styles";

interface ToastConteinerProps {
  message: ToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastConteinerProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [message.id, removeToast]);

  return (
    <Container
      type={message.type}
      hasDescription={!!message.description}
      style={style}
    >
      {icons[message.type || "info"]}
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button
        type="button"
        onClick={() => {
          removeToast(message.id);
        }}
      >
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
