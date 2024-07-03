import { Container, Title, Text, Button, Group } from '@mantine/core';
import './ErrorPage.scss';
import { Link } from 'react-router-dom';

type ErrorPageProps = {
  error?: string;
};

const ErrorPage = ({ error }: ErrorPageProps) => {
  console.log(error);
  return (
    <Container className="errorPageMainContainer">
      <div className="label">ERROR</div>
      <Title className="title">You have found a secret place.</Title>
      <Text c="dimmed" size="lg" ta="center" className="description">
        {error ? (
          <span>Unfortunately, {error}</span>
        ) : (
          <span>
            Unfortunately, you may have mistyped the address, or the page has
            been moved to another URL.
          </span>
        )}
      </Text>
      <Group justify="center">
        <Link to={'/'}>
          <Button variant="light" size="md">
            Take me back to home page
          </Button>
        </Link>
      </Group>
    </Container>
  );
};

export default ErrorPage;
