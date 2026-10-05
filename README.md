# Daylight Decision

An interactive comparison of permanent daylight saving time and permanent standard time, with city-based sunrise and sunset times, daily schedule windows, year-round charts, and a personal sunlight preference comparison.

Live site: https://daylightdecision.com

## Development

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

The sky illustration blends colors using the sun’s elevation, with a short color transition between slider steps. Sunrise, sunset, and twilight labels still use their exact calculated boundaries.

Edit `public/index.html`. The site runs entirely in the browser; there is no framework build or backend database. `npm run og` regenerates the social sharing image from the hero illustration; it renders with headless Chrome so the card can use the site typefaces.

## Validation

```sh
npm test
```

Checks cover all 81 cities across all 365 days of 2026, midnight-crossing daylight, preference extremes, invalid shared settings, Chicago astronomical fixtures from the U.S. Naval Observatory, and sky-color continuity at sunrise and twilight boundaries.

## Deployment

Cloudflare Workers serves the `public` directory as static assets. Workers Builds watches the GitHub `main` branch, runs `npm run build`, then `npm run deploy`. Wrangler's configuration is the source of truth for the Worker and its custom domains.

For an authorized manual deployment:

```sh
npm run deploy
```

The application stores settings locally in the visitor's browser and can create a shareable URL. It does not use location tracking or analytics. Typefaces (Fraunces, Source Serif 4, IBM Plex Mono) load from Google Fonts. SunCalc 1.9.0 is embedded with its MIT license; city coordinates are attributed to GeoNames (CC BY 4.0). Evidence and history sources are linked in the page.
