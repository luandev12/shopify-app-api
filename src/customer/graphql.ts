import gql from 'graphql-tag';

export const METAFIELD = gql`
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        namespace
        type
        key
        value
      }
      userErrors {
        message
      }
    }
  }
`;
