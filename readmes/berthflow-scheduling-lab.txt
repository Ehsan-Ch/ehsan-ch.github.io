# BerthFlow

BerthFlow is a synthetic port simulator. It compares first-arrived scheduling, shortest estimated service, and shortest estimated service with priority for vessels that have waited at least 12 hours.

[Open the interactive report](https://ehsan-ch.github.io/berthflow-scheduling-lab/)

In the clustered-delay scenario, shortest estimated service reduced mean vessel waiting time from **4.99 hours to 3.98 hours**. It reduced total waiting time in 34 of 40 runs and increased it in six. In the busy scenario without clustered delays, it improved average wait while increasing the number of waits of at least 12 hours from 31 to 37. Results are conditional on the synthetic workload.

## Reproduce

Run `python build.py` and `python -m unittest -v` with Python 3.12. Open the generated `index.html` directly in your browser. There are no external dependencies. The report embeds all run metrics plus the full schedule for seed 101 under each scenario and policy. The schedule CSV expresses all timestamps and durations in elapsed integer minutes.

## Experiment

- Each scenario replays 42 synthetic vessel arrivals for each seed from 101 through 140. Policies within a run receive the same vessel types, arrival times, service estimates and realized handling durations.
- Nominal arrival spacing is a uniform integer draw from 50 to 145 minutes, scaled by 3.10 for steady and 2.05 for busy and disrupted. Actual arrivals add a uniformly drawn offset of −35 to +150 minutes. In the disrupted scenario, vessels 13 through 20 arrive no earlier than minute 3700. Cargo is sampled with probability 0.64.
- Estimated service is sampled from 180–620 minutes for cargo and 325–860 minutes for tankers. Realized handling multiplies the estimate by a uniform integer percentage between 75 and 140 and rounds to a minute.
- A vessel becomes eligible at actual arrival. Idle dedicated berths are assigned before the flexible berth. Priority ties use actual arrival then vessel ID. Work runs to completion. Durations are used by the event engine to generate release times. Dispatch uses vessel class, elapsed wait, actual arrival and service estimates as appropriate to the policy.
- FIFO means first arrived among compatible vessels. The aging policy prioritizes vessels waiting at least 12 hours in order of arrival, then uses shortest estimated service for the remaining queue.
- P90 is a nearest-rank statistic within each run, then averaged across runs. Mean waits weight vessels equally because all runs contain 42 vessels. Paired savings compare total wait against FIFO within the same run. The scenarios omit tides, shared cranes, setup times and labour limits. The simulated findings do not estimate performance at a specific terminal.
