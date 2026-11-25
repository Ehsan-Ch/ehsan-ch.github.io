# Empty Container Repositioning Lab

A synthetic three-port inventory simulator for testing empty container repositioning policies. Inspect shortages and port balances, compare three demand scenarios, and export a weekly replay.

[Open the interactive report](https://ehsan-ch.github.io/empty-container-repositioning-lab/)

In the persistent imbalance scenario, the demand forecast policy fills **97.3%** of bookings, versus **79.7%** for the fixed stock floor and **76.4%** without repositioning. It averages **373 empty moves** over 18 weeks, versus **56** for the fixed floor. The scenario therefore shows a service and repositioning tradeoff. Both active policies have the same weekly cap, but their total moves and inventory targets differ.

## Reproduce

Run `python build.py` and `python -m unittest -v` with Python 3.12. Open `index.html` directly. The report uses no external dependencies.

## Model

- Atlas, Beacon and Cove start with 50 containers each. Bookings request one container each. Loaded containers and dispatched empties become available at their destination at the start of the following week. Bookings expire if unmet. Scarce stock is split proportionally across destinations by largest remainder, with lane order breaking ties.
- In each of 80 paired runs per scenario, every policy receives identical bookings across 18 weeks. Each lane has an integer weekly baseline and independent additive noise from −6 through +6 containers. The temporary surge adds 13 bookings to each Atlas outbound lane in weeks 7–11. Baselines are defined in `inventory.py`.
- After service, dispatch up to 24 empties to ports with deficits, drawing only from stock still on the dock. Balance is computed after counting loaded containers expected next week. The fixed floor targets 22 at each port. The forecast targets mean observed bookings over up to three just-completed weeks, rounded to the nearest integer, plus five. No repositioning runs after the final simulated week. The forecast assumes total requests remain visible even when supply cannot meet them.
- Recovered bookings per move aggregate avoided shortages relative to the no-move baseline and divide by all empty moves. Fill rate is total bookings shipped divided by total bookings received. The example and its CSV use the fixed seed 1. The simulation does not estimate costs, emissions, or performance for any named terminal or carrier.
