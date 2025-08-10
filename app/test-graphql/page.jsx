'use client';
import ApolloWrapper from '@/components/ApolloWrapper';
import UserManagement from '@/components/UserManagement';

export default function GraphQLTestPage() {
  return (
    <ApolloWrapper>
      <div>
        <h1>GraphQL API Test</h1>
        <UserManagement />
      </div>
    </ApolloWrapper>
  );
}
