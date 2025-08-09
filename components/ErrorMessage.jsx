import React from 'react';
import { Alert } from 'reactstrap';

const ErrorMessage = ({ children }) => (
  <Alert color="danger" fade={false}>
    {children}
  </Alert>
);

export default ErrorMessage;
