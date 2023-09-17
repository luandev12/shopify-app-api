import gql from 'graphql-tag';

export const CREATE_METAFIELD_TAG = `
  mutation customer(
    $ownerId: ID!
    $key: String!
    $namespace: String!
    $value: String!
    $type: String!
  ) {
    metafieldsSet(
      metafields: [
        {
          ownerId: $ownerId
          key: $key
          namespace: $namespace
          value: $value
          type: $type
        }
      ]
    ) {
      metafields {
        id
        key
        namespace
        type
        value
      }
    }
  }
`;

export const DELETE_METAFIELD_TAG = `
  mutation metafieldDelete($id: ID!) {
    metafieldDelete(input: { id: $id }) {
      deletedId
    }
  }
`;
