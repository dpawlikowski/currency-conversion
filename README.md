# Currency Converter

Simple currency converter, similiar to the one in Google. Made with React, TypeScript and Vite. Rates come from the [CurrencyBeacon](https://currencybeacon.com) API.

## How to run

You need Node 20.19+ and a free CurrencyBeacon API key (you get it after you register, its on the dashboard).

```bash
npm install
cp .env.example .env   # put your key in VITE_CURRENCY_BEACON_API_KEY
npm run dev
```

App runs on http://localhost:5173

Tests: `npm test`

## Stack

- React Query for the API calls
- Tailwind + shadcn/ui for the UI

## Notes

- In `/currencies` the `code` field is a number (like `840`), so I use `short_code` (`USD`) for the selects and for `/convert`.
- For the converted value I use `response.value`.
- I only load fiat currencies, crypto is skiped.
- There is no convert button, the result updates when you type (with a small debounce so it dosen't send a request on every key).
- React Query is maybe a bit much for two requests, but it gives me caching, retries and cancelling old requests for free, so I didnt have to write that myself.
- The "to" field is read only, the task only asks to convert one way.
- The API key is in the frontend, so its visible in the browser. Ok for this task, in a real app I would call the API from a backend insted.

## TODO

- convert both ways
- search in the currency list
- show the date of the rate
