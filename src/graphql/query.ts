import gql from 'graphql-tag';

export const CUSTOMER_QUERY = `
  query customers($first: Int) {
    customers(first: $first) {
      nodes {
        id
        email
        lastName
        firstName
        metafields(first: 10) {
          nodes {
            id
            key
            namespace
            value
            type
          }
        }
      }
    }
  }
`;
