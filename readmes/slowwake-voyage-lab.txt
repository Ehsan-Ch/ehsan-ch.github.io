# SlowWake

SlowWake compares constant-speed sailing with a schedule that chooses a speed on each leg of a synthetic 240-nautical-mile voyage. The interactive report lets you set an arrival deadline and route conditions, inspect the plan, and export both schedules.

[Open the live explorer](https://ehsan-ch.github.io/slowwake-voyage-lab/)

At a 20-hour deadline under mixed currents and loads, the model uses **14.25 tonnes of fuel** with variable speed and **15.93 tonnes** with constant speed. The difference is **10.6%**, or about **5.40 tonnes of direct CO₂**. The plans meet the same deadline and have different actual arrival times. With calm conditions at that deadline, the plans tie.

## Reproduce

Run `python build.py` and `python -m unittest -v` with Python 3.12. Open the generated `index.html` directly in a browser. The report has no external dependencies.

## Model

- Three synthetic profiles each contain six legs of 40 nautical miles. Along-track current (knots) adds to speed through water to produce ground speed. Each leg also has an illustrative resistance multiplier.
- Choose integer speeds from 9 to 18 knots. Travel time is distance divided by ground speed. The deadline check uses the sum of leg times rounded up to minutes. Fuel uses unrounded time and rounds each leg's burn to grams.
- Fuel rate in tonnes per hour is 0.10 + 0.78 × load × (speed / 14)³. Both coefficients and the cubic curve are simplifying assumptions.
- Dynamic programming stores the lowest fuel cost for each reachable elapsed minute. This is valid because future costs depend only on the next leg and its speed, with fixed route conditions. Among feasible complete plans, break ties by earlier arrival and then by speed sequence. The baseline enumerates every constant speed on the same grid.
- Direct combustion CO₂ multiplies fuel by 3.206, the diesel/gas oil factor in [IMO resolution MEPC.364(79)](https://wwwcdn.imo.org/localresources/en/KnowledgeCentre/IndexofIMOResolutions/MEPCDocuments/MEPC.364%2879%29.pdf).

The savings combine weather and current adjustment with better use of deadline slack under discrete speeds. The model assumes deterministic conditions and an illustrative fuel curve. It omits manoeuvring fuel, speed-change costs, port waiting fuel, upstream emissions and constraints such as safe sailing limits. The results are conditional on the synthetic model.
