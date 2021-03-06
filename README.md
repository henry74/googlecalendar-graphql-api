# Note: This is no longer being updated.  Please see https://github.com/henry74/gsuite-graphql-server for the latest

# Simple GraphQL API for Google Calendar

## Setup

1. Create a new Google project and enable Google Calendar API
2. Create `OAuth 2.0 client ID` credentials
3. Copy `Client ID` and `Client Secret` into .env

```bash
# See .env.example for required environment variables
```

Generate token manually (can also be done through API)

```
yarn authorize
```

### API Usage

Terminal/CLI

```bash
yarn start # start graphql playground on http://localhost:4000
```

Dockerfile (after building)

```
docker run -d \
   -p 4004:4000 \
   -e GOOGLE_OAUTH2_CLIENT_ID="123412341234-randombunchofcharacters.apps.googleusercontent.com" \
   -e GOOGLE_OAUTH2_CLIENT_SECRET="1234asdf1234" \
   -e GOOGLE_OAUTH2_REDIRECT_URL="urn:ietf:wg:oauth:2.0:oob" \
   -e TOKEN_PATH=./token.json \
   your/image:latest

```

Click schema tab within graphQL playground for details
