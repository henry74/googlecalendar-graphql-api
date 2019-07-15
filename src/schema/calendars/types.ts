import { gql } from "apollo-server-express";
import { GraphQLJSON, GraphQLJSONObject } from "graphql-type-json";

export const typeDef = gql`
  scalar JSON
  scalar JSONObject

  type Time {
    dateTime: String
    timeZone: String
  }

  type CalendarEvent {
    kind: String
    etag: String
    status: String
    htmlLink: String
    id: ID
    summary: String
    description: String
    location: String
    start: Time
    end: Time
  }

  type CalendarListEntry {
    id: String
    summary: String
    accessRole: String
  }
`;

export const resolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject
};
