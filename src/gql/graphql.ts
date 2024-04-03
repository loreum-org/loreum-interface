import { gql } from "graphql-request";

export const getChamberDeployedsQuery = gql`
query {
  chamberDeployeds(orderBy: serial) {
    chamber
    govToken
    memberToken
    deployer
    serial
  }
}
`;

export const getChamberByAddressQuery = gql`
query getChamberByAddress($chamberAddress: String!) {
  chamberDeployeds(where: {chamber: $chamberAddress}) {
    chamber
    deployer
    govToken
    memberToken
    serial
  }
}
`;

export const getProposals = gql`
query getProposals($chamberAddress: String!) {
  createdProposals(orderBy: blockTimestamp, orderDirection: desc, where: {chamber: $chamberAddress}) {
    transactionHash
    proposalId
    blockTimestamp
    target
    value
    data
    voters
  }
}
`