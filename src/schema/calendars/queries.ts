import { gql } from "apollo-server-express";

export const typeDef = gql`
  extend type Query {
    "List available calendars"
    calendars: [CalendarListEntry]!
    "Fetch events for a calendar"
    events(calendarId: String, maxResults: Int): [CalendarEvent]
    "Generate auth URL for authentication"
    authUrl: String!
  }
`;

export const resolvers = {
  Query: {
    calendars: (root, {}, { services: { calendars } }) => {
      return calendars.list();
    },
    events: (root, { calendarId, maxResults }, { services: { calendars } }) => {
      return calendars.events(calendarId, maxResults);
    },
    authUrl: (root, {}, { services: { calendars } }) => {
      return calendars.authUrl();
    }
  }
};
