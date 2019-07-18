import { google } from "googleapis";
import envVars from "../../config/envVars";
import { CalendarListEntry, CalendarEvent } from "../../generatedTypes";
import { ApolloError } from "apollo-server-core";
import { OAuth2Client } from "googleapis-common";
import * as fs from "fs-extra";
import logger from "../../util/logger";

const GOOGLE_OAUTH2_CLIENT_ID = envVars().GOOGLE_OAUTH2_CLIENT_ID;
const GOOGLE_OAUTH2_CLIENT_SECRET = envVars().GOOGLE_OAUTH2_CLIENT_SECRET;
const GOOGLE_OAUTH2_REDIRECT_URL = envVars().GOOGLE_OAUTH2_REDIRECT_URL;
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const TOKEN_PATH = envVars().TOKEN_PATH;

const authClient = new google.auth.OAuth2(
  GOOGLE_OAUTH2_CLIENT_ID,
  GOOGLE_OAUTH2_CLIENT_SECRET,
  GOOGLE_OAUTH2_REDIRECT_URL
);

async function fetchAuthClient(): Promise<OAuth2Client> {
  const tokens = await fetchAccessTokens();
  authClient.setCredentials(tokens);
  return authClient;
}

async function fetchAccessTokens() {
  if (await fs.pathExists(TOKEN_PATH)) {
    const tokens = await fs.readJson(TOKEN_PATH);
    // logger.debug(`Found cached tokens ${TOKEN_PATH}`);
    if (tokens) return tokens;
  }
  logger.error("No tokens found - please authorize");
  return "";
}

export const setOAuthCode = async (code: string) => {
  const { tokens } = await authClient.getToken(code);
  fs.writeJson(TOKEN_PATH, tokens);
  logger.debug("Token stored to", TOKEN_PATH);
  return tokens;
};

export const authUrl = async (): Promise<String> => {
  const authUrl = await authClient.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  return authUrl;
};

export const list = async (): Promise<Array<CalendarListEntry>> => {
  const auth = await fetchAuthClient();
  const calendar = google.calendar({ version: "v3", auth });
  try {
    const { data } = await calendar.calendarList.list();
    const response = data.items.map(calendar => {
      const { id, summary, primary, accessRole } = calendar;
      return {
        id,
        summary,
        primary,
        accessRole
      };
    });
    return response;
  } catch (err) {
    throw new ApolloError(err);
  }
};

export const aggregateEvents = async (
  calendarList: Array<string>,
  maxResults: number = 10
): Promise<Array<CalendarEvent>> => {
  const results = await Promise.all(
    calendarList.map(calendarId => {
      return events(calendarId, maxResults);
    })
  );

  return results
    .flat()
    .sort((a, b) => {
      return Date.parse(a.start.dateTime) - Date.parse(b.start.dateTime);
    })
    .slice(0, maxResults);
};

export const events = async (
  calendarId: string,
  maxResults: number = 10
): Promise<Array<CalendarEvent>> => {
  const auth = await fetchAuthClient();
  const calendar = google.calendar({ version: "v3", auth });
  try {
    const { data } = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: "startTime"
    });
    const response = data.items.map(event => {
      const {
        kind,
        etag,
        status,
        htmlLink,
        id,
        summary,
        description,
        location,
        start,
        end
      } = event;

      return {
        kind,
        etag,
        status,
        htmlLink,
        id,
        summary,
        description: description ? description : "",
        location: location ? location : "",
        start: {
          ...start,
          ...{
            dateTime: start.dateTime || start.date,
            timeZone: start.timeZone ? start.timeZone : ""
          }
        },
        end: {
          ...end,
          ...{
            dateTime: end.dateTime || end.date,
            timeZone: end.timeZone ? end.timeZone : ""
          }
        }
      };
    });
    return response;
  } catch (err) {
    throw new ApolloError(err);
  }
};
