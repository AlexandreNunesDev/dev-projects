import { Container } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';

function LoadingProgress() {
  return (
    <Spinner animation="border" role="status">
    </Spinner>
  );
}

export default LoadingProgress;