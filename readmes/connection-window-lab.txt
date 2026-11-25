# Connection Window Lab

A synthetic transshipment replay that compares outbound sailing on schedule with capped holds of 30, 60 and 90 minutes. Explore three inbound scenarios, inspect cargo readiness for a fixed example, and download the selected replay.

[Open the interactive report](https://ehsan-ch.github.io/connection-window-lab/)

In the late-inbound scenario, sailing on schedule misses **136.0 TEU per departure** on average. A 30-minute hold cap recovers **73.8 TEU** on average and adds **28.2 minutes** of mean departure delay. Thirteen of 160 runs incur a hold that recovers no cargo. The input and outcomes are synthetic.

## Reproduce

Use Python 3.12 and run `python build.py` followed by `python -m unittest -v`. Open `index.html` directly. The page has no external dependencies.

## Experiment

- Replay 160 seeded manifests in each of three profiles. Each manifest has three inbound vessels, scheduled at minutes 65, 105 and 140, with four transfer lots per inbound vessel. Lot sizes are sampled from 10 through 45 TEU in increments of five. [OECD maritime transport glossary hosted by UNCTAD](https://unctad.org/system/files/non-official-document/dtltlbts-MyEM6thd07_OECD_en.pdf)
- Inbound delay is uniform over 0–35 minutes in the normal profile and 30–105 minutes in both late profiles. Each lot takes 25–95 minutes from actual arrival to readiness. The congested profile adds one shared 0–35 minute delay per manifest. Random draws use inclusive integer ranges.
- The sailing cutoff is minute 240 and scheduled departure is minute 270. A capped hold moves both times together. The policy waits when any manifested lot remains unready, releasing by the cap or as soon as the final outstanding readiness event arrives. Lots ready exactly at the cutoff qualify.
- Every policy sees the identical manifest and readiness events within a replay. Recovered volume is the increase in qualifying TEU over sailing on schedule. Recovered TEU per vessel-hour held uses total recovered TEU divided by total hold hours.
- The selected scenario shows the fixed seed 1 for the example timeline and CSV. The summary aggregates all 160 seeds per profile.

Cargo readiness is used as a proxy for making the connection and berth occupancy, outbound capacity, detailed terminal operations, network delay and rebooking are outside scope. The observed tradeoffs depend on the synthetic arrival and handling distributions.
