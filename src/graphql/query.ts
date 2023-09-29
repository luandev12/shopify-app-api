import gql from 'graphql-tag';

export const CUSTOMER_QUERY = `
  query customers($first: Int) {
    customers(first: $first) {
      nodes {
        id
        email
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

export const CURRENT_BULK_OPERATION = `
  query currentBulkOperation {
    currentBulkOperation {
      id
      fileSize
      objectCount
      url
      status
      query
    }
  }
`;
