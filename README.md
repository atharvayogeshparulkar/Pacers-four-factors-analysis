# Pacers Four Factors Analysis

## Steps

1. [Review the data](#step-1-review-the-data)
2. [Set up the environment](#step-2-set-up-the-environment)
3. [Run the Four Factors analysis](#step-3-run-the-four-factors-analysis)
4. [Read the results](#step-4-read-the-results)
5. [Run the SQL queries](#step-5-run-the-sql-queries)
6. [Open the strategy deck](#step-6-open-the-strategy-deck)
7. [Check assumptions and limitations](#step-7-check-assumptions-and-limitations)

---

## Step 1: Review the data

Put these input files in a `data/` folder:

- `pacers_games_four_factors.csv`: 82 Pacers games with eFG%, OREB%, TOV% and FTM rate for the Pacers and their opponents, plus the result
- `league_avg_four_factors.csv`: league-average value for each factor
- `Intern_Project_SQL_Sample_Data.xlsx`: sample `Players`, `Teams`, `Games` and `Player_Stats` tables

Next: [Step 2](#step-2-set-up-the-environment)

## Step 2: Set up the environment

```bash
git clone https://github.com/<your-username>/pacers-four-factors-analysis.git
cd pacers-four-factors-analysis
pip install pandas numpy matplotlib statsmodels
```

If your data is not in `./data`, set `DATA_DIR=/path/to/files` before running the script.

Next: [Step 3](#step-3-run-the-four-factors-analysis)

## Step 3: Run the Four Factors analysis

Run [`four_factors_plots.py`](four_factors_plots.py):

```bash
python four_factors_plots.py
```

It creates four plots, a 2x2 summary, and prints the statistics table:

- [`plot_efg_pct.png`](plot_efg_pct.png)
- [`plot_oreb_pct.png`](plot_oreb_pct.png)
- [`plot_tov_pct.png`](plot_tov_pct.png)
- [`plot_ftm_rate.png`](plot_ftm_rate.png)
- [`plots_four_factors_grid.png`](plots_four_factors_grid.png)

Each plot shows every game, Pacers vs. opponent, colored by win/loss, with league-average cross-hairs. Axes are flipped where lower is better, so the top-right quadrant is always good for the Pacers.

Next: [Step 4](#step-4-read-the-results)

## Step 4: Read the results

| Factor | Correlation with win | Win % when Pacers win the factor | Win % when they lose it |
|---|---|---|---|
| **eFG%** | **0.63** | **90%** (37-4) | 32% (13-28) |
| OREB% | 0.20 | 75% | 54% |
| TOV% | 0.20 | 66% | 52% |
| FTM rate | 0.17 | 60% | 63% |

- **eFG% was the most important factor.** In wins the Pacers averaged 58.2% eFG% against 52.3% allowed. In losses it was 53.1% against 58.6% allowed.
- A logistic regression on standardized differentials agrees: eFG% 13.2, TOV% 6.2, OREB% 5.3, FTM rate 2.5.
- The clearest weakness is offensive rebounding: 25.2% vs. 29.3% league average.

Next: [Step 5](#step-5-run-the-sql-queries)

## Step 5: Run the SQL queries

Open [`pacers_sql_queries.sql`](pacers_sql_queries.sql). It answers four questions using inner and left joins only:

1. PPG for 2024 regular-season players with under 500 minutes
2. Total 2024 playoff games per team (uses a CTE)
3. Top 10 playoff FGA/36 among players who started under 50% of their regular-season games
4. Top 5 teams by gap between average win margin and average loss margin

The queries were tested by loading the workbook tables into SQLite.

Next: [Step 6](#step-6-open-the-strategy-deck)

## Step 6: Open the strategy deck

Open [`Pacers_Analytics_Deck.pptx`](Pacers_Analytics_Deck.pptx) (5 slides):

1. Strengths and weaknesses
2. Expected 2026-27 outcome
3. Trade targets: Donovan Clingan (stretch, fixes rebounding) and Kevin Porter Jr. (realistic, second creator)
4. Undervalued player: Jay Huff
5. Method, sources and code

To rebuild the deck, edit and run [`build_deck.js`](build_deck.js):

```bash
npm install pptxgenjs
node build_deck.js
```

Next: [Step 7](#step-7-check-assumptions-and-limitations)

## Step 7: Check assumptions and limitations

**Assumptions**
- A factor counts as "won" in a game when the Pacers' edge over the opponent is positive, with the sign adjusted so higher is always better.
- SQL: `point_difference` is an absolute margin, so Q4 treats a loss as negative. `minutes` is a season total. Q3 takes FGA/36 from the playoff row and the starter share from the regular-season row.

**Limitations**
- The Four Factors data covers one season (82 games), so splits like 37-4 come from small samples.
- The win-total scenarios in the deck are judgment-based, not a fitted model.
- Rosters, contracts and player stats come from public sources (ESPN, RealGM, TeamRankings, Bleacher Report, RotoWire, Roundtable/SI) and change quickly. Verify before relying on them.
