export type Maybe<T> = T | null;

/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
export type JsonObject = any;

/** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
export type Json = any;

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Types
// ====================================================

export interface Query {
  unused?: Maybe<string>;
  /** List available calendars */
  calendars: (Maybe<CalendarListEntry>)[];
  /** Fetch events for a calendar */
  events?: Maybe<(Maybe<CalendarEvent>)[]>;
  /** Generate auth URL for authentication */
  authUrl: string;
}

export interface CalendarListEntry {
  id?: Maybe<string>;

  summary?: Maybe<string>;

  accessRole?: Maybe<string>;
}

export interface CalendarEvent {
  kind?: Maybe<string>;

  etag?: Maybe<string>;

  status?: Maybe<string>;

  htmlLink?: Maybe<string>;

  id?: Maybe<string>;

  summary?: Maybe<string>;

  description?: Maybe<string>;

  location?: Maybe<string>;

  start?: Maybe<Time>;

  end?: Maybe<Time>;
}

export interface Time {
  dateTime?: Maybe<string>;

  timeZone?: Maybe<string>;
}

export interface Mutation {
  unused?: Maybe<string>;

  setOAuthCode?: Maybe<JsonObject>;
}

export interface Subscription {
  unused?: Maybe<string>;
}

// ====================================================
// Arguments
// ====================================================

export interface EventsQueryArgs {
  calendarId?: Maybe<string>;

  maxResults?: Maybe<number>;
}
export interface SetOAuthCodeMutationArgs {
  code: string;
}
