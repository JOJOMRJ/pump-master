import React from 'react';
import { Link } from 'react-router-dom';

export const LoginFooter: React.FC = () => {
  return (
    <div className="text-center mt-3">
      <small className="text-muted">
        Don't have an account?{' '}
        <Link to="/register" className="text-decoration-none">
          Register
        </Link>
      </small>
    </div>
  );
};

export default LoginFooter;
