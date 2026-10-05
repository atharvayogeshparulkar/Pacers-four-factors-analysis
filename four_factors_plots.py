import pandas as pd, numpy as np, matplotlib.pyplot as plt
from matplotlib.ticker import PercentFormatter
import statsmodels.api as sm

import os
U = os.environ.get("DATA_DIR", "data") + "/"
g = pd.read_csv(U + "pacers_games_four_factors.csv")
lg = pd.read_csv(U + "league_avg_four_factors.csv").iloc[0]

# (title, pacers col, opp col, league col, higher_is_better_for_pacers_on_x)
F = [("eFG%", "efg_pct", "opp_efg_pct", "efg_pct", True),
     ("OREB%", "oreb_pct", "opp_oreb_pct", "oreb_pct", True),
     ("TOV%", "tov_pct", "opp_tov_pct", "tov_pct", False),
     ("FTM Rate", "ftm_rate", "oftm_rate", "ftm_rate", True)]
COL = {True: "#1f9bb0", False: "#f2705f"}

def draw(ax, name, x, y, lgc, hib):
    avg = lg[lgc]
    for w in (False, True):
        d = g[g.win == w]
        ax.scatter(d[x], d[y], c=COL[w], s=22, label=("Win" if w else "Loss"))
    ax.axvline(avg, c="k", lw=1); ax.axhline(avg, c="k", lw=1)
    # orient axes so the top-right quadrant is always "good" for the Pacers
    if hib: ax.invert_yaxis()          # opp metric: lower is better
    else:   ax.invert_xaxis()          # own TOV%: lower is better
    ax.xaxis.set_major_formatter(PercentFormatter(1, 0)); ax.yaxis.set_major_formatter(PercentFormatter(1, 0))
    ax.set_xlabel(name if hib else f"{name} (reversed)", fontweight="bold")
    ax.set_ylabel(f"Opp. {name}" + (" (reversed)" if hib else ""), fontweight="bold")
    ax.set_title(f"2024-25 Pacers {name} vs. Opp. {name}", loc="left", fontweight="bold")
    for s in ("top", "right"): ax.spines[s].set_visible(False)

rows = []
for name, x, y, lgc, hib in F:
    fig, ax = plt.subplots(figsize=(7, 5.5)); draw(ax, name, x, y, lgc, hib)
    ax.legend(title="Result", frameon=False); fig.text(0.01, 0.01, f"Lines = league avg ({lg[lgc]:.1%}). Top-right = Pacers win the factor on both ends.", fontsize=7)
    fig.tight_layout(); fig.savefig(f"plot_{lgc}.png", dpi=160); plt.close(fig)
    # sign-adjusted differential: positive = Pacers won the factor
    diff = (g[x] - g[y]) if hib else (g[y] - g[x])
    g["d_" + lgc] = diff
    sd = diff.std()
    both = ((g[x] > lg[lgc]) == hib) & ((g[y] < lg[lgc]) == hib)  # good on both ends
    rows.append(dict(factor=name, corr_with_win=np.corrcoef(diff, g.win)[0, 1],
                     win_pct_when_won_factor=g.win[diff > 0].mean(), n_won=(diff > 0).sum(),
                     win_pct_when_lost_factor=g.win[diff <= 0].mean(),
                     win_pct_good_quadrant=g.win[both].mean(), n_quad=both.sum(),
                     avg_diff_wins=diff[g.win].mean(), avg_diff_losses=diff[~g.win].mean(), sd=sd))
res = pd.DataFrame(rows).round(3); print(res.to_string(index=False))

# standardized logistic regression: which factor differential moves win probability most?
X = g[[f"d_{f[3]}" for f in F]]; X = (X - X.mean()) / X.std()
m = sm.Logit(g.win.astype(int), sm.add_constant(X)).fit(disp=0); print(m.summary2().tables[1].round(3))

fig, axs = plt.subplots(2, 2, figsize=(13, 10))
for a, (name, x, y, lgc, hib) in zip(axs.flat, F): draw(a, name, x, y, lgc, hib)
axs[0, 0].legend(title="Result", frameon=False); fig.tight_layout(); fig.savefig("plots_four_factors_grid.png", dpi=130)
print("record", g.win.sum(), "-", (~g.win).sum())
