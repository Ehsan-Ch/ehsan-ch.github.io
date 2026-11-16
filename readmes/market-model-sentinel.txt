# Sentinel — Market Model Monitoring

An independent financial ML operations project: replay saved forecasts, ingest delayed packets, score matured outcomes and manage alert lifecycles.

**[Open the lab](https://ehsan-ch.github.io/market-model-sentinel/)**

## Run

Node 22 or later, no dependencies or API keys:

```sh
npm test
npm start
```

Open http://127.0.0.1:8797/. GitHub Pages serves the repository root.

## Monitoring contract

- Forecasts enter only at their receipt time. Outcomes enter scoring only at label availability, 60 seconds after prediction.
- IDs are deduplicated; invalid probability vectors and invalid timing are excluded.
- Performance uses the latest 60 matured outcomes, with a minimum of 30. Log loss >1.3 is an illustrative breach.
- Freshness breaches when the latest accepted prediction is older than 40 seconds or none exists.
- Quality counts duplicate/invalid packets cumulatively for the day. It stays breached until reset or a fresh day, while freshness/performance can recover.
- Two consecutive breach checks open an incident. Two clear checks resolve it. Checks occur every ten seconds, starting at the first forecast.
- The JSON export contains the replay history, active rules and incident transitions through the selected clock only.

These thresholds demonstrate monitoring behavior; they were not selected as production statistical alarms. Replay is recomputed from its beginning for deterministic slider behavior. No notification is sent and no trade is executed.

## Data and scenarios

The bundled 480 forecast records are the first 120 evaluated timestamps on each of four TickLab test days: 7, 10, 13 and 14 January 2024. They contain calibrated boosted-tree probabilities, class labels and availability timestamps, derived from ETHUSDT trades. They are a small historical crypto proxy, not equities validation or live monitoring evidence.

Source: [TickLab release b0d473d](https://github.com/Ehsan-Ch/tick-calibration-lab/tree/b0d473d754665cc792da95a032f9988dc4f84aab), originally Binance Vision aggregate trades. `data.json` records the SHA256 of the input report. To rebuild:

```sh
node build-data.mjs /absolute/path/to/tick-calibration-lab/docs/data/report.json
```

Original forecasts remain intact. Three separately labeled drills inject: probability sharpening over rows30–84, a120-second receipt delay over rows40–64, or a duplicate and invalid vector at row45. Faults are simulated engineering exercises, not claims about historical operational failures. Full labels are bundled for local replay; masking is an availability demonstration, not a security boundary.

## Validation and relevance

Tests cover maturity boundaries, future-data invariance, late arrival, input rejection, rolling windows, deterministic scenarios and incident opening/recovery. CI runs Node22/24. Browser and publication evidence is recorded in `VERIFICATION.md` after release.

The project follows TickLab's research work with model monitoring and failure handling relevant to financial ML roles. It is independent portfolio work with no Alipes or Binance affiliation. Production adoption would require an authenticated persistent stream, restart-safe state, real arrival timestamps, operationally calibrated thresholds and a longer evaluation.

## License

Original source code: MIT (`LICENSE`). Bundled forecast data, data-backed displays and derived audits: [CC BY-NC-SA4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), with attribution to Binance Vision and Ehsan Cheraghi / TickLab. Preserve attribution, indicate changes and retain the same license for covered adaptations. See [TickLab data terms](https://github.com/Ehsan-Ch/tick-calibration-lab/blob/main/DATA_LICENSE.md). No raw trades are redistributed.
