# ETA Reliability Lab

A synthetic shipping benchmark for forecast intervals around vessel arrival time. It compares a fixed two-hour radius with pooled and distance-specific calibration. Explore three nominal levels, filter by voyage length, and export examples.

[Open the interactive report](https://ehsan-ch.github.io/eta-reliability-lab/)

At the **90% target**, distance-group calibration covered **91.7%** of reference voyages with a mean width of **5.95 hours**. Pooled calibration covered **91.9%** with a mean width of **6.81 hours**. The pooled method covered all 271 short voyages and 83.2% of long voyages. Distance-specific calibration covered 92.3% of short voyages and 91.1% of long voyages. Under the synthetic disruption, coverage fell to 38.5% for distance-group calibration and 49.8% for pooled calibration. The disruption is an illustrative shift in voyage conditions, and the reference-calibrated intervals are deliberately held fixed.

## Reproduce

Run `python build.py` and `python -m unittest -v` with Python 3.12. Open `index.html` directly. No dependencies are required.

## Method

- The generator supplies distance, planned speed, fair/rough weather, and light/busy queue conditions. Observed duration combines perturbed sailing time with a queue delay. Stress adds a further random slowdown of 2–14% of planned sailing time and up to 3.5 hours of waiting, without telling the ETA model.
- The point model uses distance divided by planned speed, corrected by the training median residual for the combination of weather, queue and distance group. Training, calibration, reference test and stress test use separate seeds and sample sizes of 1,800, 900, 1,200 and 1,200 respectively. No test outcomes enter model fitting or calibration.
- For nominal level q and n calibration errors, use the error at one-indexed rank ceil((n+1)q). Pooled uses all errors, and grouped computes a separate rank within each distance band. Intervals use the same point estimate, add and subtract the radius, and clip the lower bound to zero. See [Angelopoulos and Bates on conformal prediction](https://arxiv.org/abs/2107.07511).
- Coverage is measured using unrounded values. Interval bounds and point predictions in the exported examples are displayed to four decimal places. The first 12 voyages in the chosen cohort are shown. The summary uses every voyage in that cohort.
- The simulator assumes synthetic, independently generated voyages. A vessel fleet may introduce correlations, measurement errors, and time-dependent conditions that are outside the model. Split calibration relies on exchangeable calibration and future cases, which the stress scenario deliberately violates.
