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

export const WEBHOOK_BULK_OPERATION = `
  mutation webhookSubscriptionCreate($url: String!){
    webhookSubscriptionCreate(
      topic: BULK_OPERATIONS_FINISH
      webhookSubscription: {
        format: JSON
        callbackUrl: $url
      }
    ) {
      userErrors {
        field
        message
      }
      webhookSubscription {
        id
      }
    }
  }
`;

export const INSERT_PRODUCTS_BULK = `
  mutation {
    bulkOperationRunQuery(
      query: """
      {
        products {
          edges {
            node {
              id
              title
              variants {
                edges {
                    node {
                        title
                        inventoryQuantity
                        id
                        sku
                        inventoryItem {
                          id
                        }
                        metafields {
                          edges {
                            node {
                              namespace
                              key
                              value
                            }
                          }
                        }
                    }
                }
              }
            }
          }
        }
      }
      """
    ) {
      bulkOperation {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const STAGED_UPLOADS_CREATE = `
  mutation {
    stagedUploadsCreate(
      input: {
        resource: BULK_MUTATION_VARIABLES
        filename: "bulk_op_vars"
        mimeType: "text/jsonl"
        httpMethod: POST
      }
    ) {
      userErrors {
        field
        message
      }
      stagedTargets {
        url
        resourceUrl
        parameters {
          name
          value
        }
      }
    }
  }
`;
