import { gql } from "graphql-request";

export const getChamberDeployedsQuery = gql`
query {
  chamberDeployeds {
    chamber
    govToken
    memberToken
    deployer
    serial
  }
}
`;