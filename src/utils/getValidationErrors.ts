import { ValidationError } from "yup";

interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach((error) => {
    const { path, message } = error;
    validationErrors[String(path)] = String(message);
  });

  return validationErrors;
}
