'use client';

import { Row, Col } from 'reactstrap';
import { useUser } from '@auth0/nextjs-auth0';

import Loading from '../../components/Loading';
import Highlight from '../../components/Highlight';
import { useEffect } from 'react';

export default function Profile() {
  const { user, isLoading } = useUser();

  return (
    <>
      {isLoading && <Loading />}
      {user && (
        <>
          <Row className="align-items-center profile-header mb-5 text-center text-md-left" >
            <Col md={2}>
              <img
                src={user.picture}
                alt="Profile"
                className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                decode="async"
              />
            </Col>
            <Col md>
              <h2>{user.name}</h2>
              <p className="lead text-muted">
                {user.email}
              </p>
            </Col>
          </Row>
          <Row>
            <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
          </Row>
        </>
      )}
    </>
  );
}
