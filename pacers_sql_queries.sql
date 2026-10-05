-- Tables: Players, Teams, Games, Player_Stats (left/inner joins only)
-- Player_Stats = season totals per player (season, game_type = 'regular' | 'playoffs')

-- Q1: PPG for 2024 regular-season players with < 500 minutes
SELECT p.full_name,
       ROUND(1.0 * ps.pts / ps.games_played, 1) AS ppg
FROM Players p
INNER JOIN Player_Stats ps ON ps.player_id = p.player_id
WHERE ps.season = 2024 AND ps.game_type = 'regular'
  AND ps.minutes < 500 AND ps.games_played > 0
ORDER BY ppg DESC;

-- Q2: CTE, total 2024 playoff games per team (a team is home OR away)
WITH playoff_games AS (
    SELECT t.team_id, COUNT(g.game_id) AS total_games
    FROM Teams t
    INNER JOIN Games g
            ON t.team_id IN (g.home_team_id, g.away_team_id)
    WHERE g.season = 2024 AND g.game_type = 'playoffs'
    GROUP BY t.team_id
)
SELECT t.team_full_name, pg.total_games
FROM Teams t
INNER JOIN playoff_games pg ON pg.team_id = t.team_id
ORDER BY pg.total_games DESC;

-- Q3: Top 10 playoff FGA/36, starters in < 50% of regular-season games played
SELECT p.full_name,
       ROUND(36.0 * po.fga / po.minutes, 2) AS fga_per_36
FROM Players p
INNER JOIN Player_Stats po ON po.player_id = p.player_id
                          AND po.season = 2024 AND po.game_type = 'playoffs'
INNER JOIN Player_Stats rs ON rs.player_id = p.player_id
                          AND rs.season = 2024 AND rs.game_type = 'regular'
WHERE po.minutes > 0 AND rs.games_played > 0
  AND 1.0 * rs.games_started / rs.games_played < 0.5
ORDER BY fga_per_36 DESC
LIMIT 10;

-- Q4: Top 5 teams by (avg margin in wins) - (avg signed margin in losses), 2024 regular season
-- point_difference is an absolute margin, so a loss counts as -point_difference.
SELECT t.team_full_name,
       ROUND(AVG(CASE WHEN g.winner =  t.team_id THEN  g.point_difference END)
           - AVG(CASE WHEN g.winner <> t.team_id THEN -g.point_difference END), 2) AS win_loss_margin_gap
FROM Teams t
INNER JOIN Games g ON t.team_id IN (g.home_team_id, g.away_team_id)
WHERE g.season = 2024 AND g.game_type = 'regular'
GROUP BY t.team_id, t.team_full_name
ORDER BY win_loss_margin_gap DESC
LIMIT 5;
