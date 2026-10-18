/* ════════════════════════════════════════════════════════════════
   BASEBALL STATS: all the numbers live here.

   One line per season with one team (and one competition). To add a new
   season, copy a line from the same team, change the season and the numbers.
   Leave out any stat that wasn't recorded (don't write 0 for "unknown").

   Where the numbers come from:
     Bergen Wet Sox (Norway)   stats.soft-baseball.no
     London Mets (UK)          stats.britishbaseball.org.uk
     Southern Virginia Univ.   knightathletics.com (roster > Stats tab)
   competition: 'Regular season' or 'NM i Baseball' (the Norwegian championship).
═════════════════════════════════════════════════════════════════ */
window.BASEBALL = {
  player: { "name": "Mitch Tyse", "bats": "R", "throws": "R", "hometown": "Boulder, Colorado", "notes": "Father from Norway. Southern Virginia = Division III (CAC). SVU 2019 bio text says 70 AB/22 H; stat table (used) says 66 AB/21 H." },

  // g games, gs games started, ab at-bats, r runs, h hits, doubles, triples, hr home runs, rbi, tb total bases, bb walks, hbp hit by pitch, so strikeouts, gdp, sf sac flies, sh sac bunts, sb stolen bases, cs caught stealing
  batting: [
    { "season":2018, "level":"College", "competition":"Regular season", "country":"USA", "team":"Southern Virginia University", "league":"CAC (NCAA Division III)", "g":8, "gs":4, "ab":16, "r":1, "h":1, "doubles":1, "triples":0, "hr":0, "rbi":2, "tb":2, "bb":4, "hbp":0, "so":9, "gdp":0, "sf":0, "sh":1, "sb":0, "cs":0 },
    { "season":2019, "level":"College", "competition":"Regular season", "country":"USA", "team":"Southern Virginia University", "league":"CAC (NCAA Division III)", "g":22, "gs":16, "ab":66, "r":12, "h":21, "doubles":6, "triples":0, "hr":3, "rbi":13, "tb":36, "bb":2, "hbp":1, "so":22, "gdp":0, "sf":2, "sh":0, "sb":0, "cs":0 },
    { "season":2020, "level":"College", "competition":"Regular season", "country":"USA", "team":"Southern Virginia University", "league":"CAC (NCAA Division III)", "g":14, "gs":14, "ab":54, "r":10, "h":18, "doubles":4, "triples":0, "hr":6, "rbi":20, "tb":40, "bb":1, "hbp":1, "so":19, "gdp":0, "sf":0, "sh":0, "sb":0, "cs":0 },
    { "season":2022, "level":"Pro-Am club", "competition":"Regular season", "country":"Norway", "team":"Bergen Wet Sox", "league":"Eliteserien Baseball", "g":4, "gs":4, "ab":10, "r":2, "h":1, "doubles":0, "triples":0, "hr":0, "rbi":0, "tb":1, "bb":2, "hbp":1, "so":2, "gdp":0, "sf":0, "sh":0, "sb":0, "cs":0 },
    { "season":2023, "level":"Pro-Am club", "competition":"Regular season", "country":"Norway", "team":"Bergen Wet Sox", "league":"Eliteserien Baseball", "g":16, "gs":16, "ab":46, "r":23, "h":23, "doubles":9, "triples":1, "hr":4, "rbi":23, "tb":46, "bb":17, "hbp":3, "so":8, "gdp":0, "sf":1, "sh":0, "sb":9, "cs":0 },
    { "season":2023, "level":"Pro-Am club", "competition":"NM i Baseball", "country":"Norway", "team":"Bergen Wet Sox", "league":"NM i Baseball", "g":2, "gs":2, "ab":7, "r":1, "h":3, "doubles":0, "triples":0, "hr":0, "rbi":4, "tb":3, "bb":0, "hbp":0, "so":1, "gdp":0, "sf":0, "sh":0, "sb":0, "cs":0 },
    { "season":2024, "level":"Pro-Am club", "competition":"Regular season", "country":"Great Britain", "team":"London Mets", "league":"National Baseball League (NBL)", "g":12, "gs":12, "ab":40, "r":16, "h":11, "doubles":1, "triples":0, "hr":1, "rbi":7, "tb":15, "bb":2, "hbp":4, "so":10, "gdp":0, "sf":0, "sh":0, "sb":5, "cs":0 },
    { "season":2025, "level":"Pro-Am club", "competition":"Regular season", "country":"Norway", "team":"Bergen Wet Sox", "league":"Eliteserien Baseball", "g":14, "gs":14, "ab":46, "r":13, "h":18, "doubles":5, "triples":1, "hr":0, "rbi":18, "tb":25, "bb":8, "hbp":3, "so":7, "gdp":0, "sf":2, "sh":0, "sb":7, "cs":1 },
    { "season":2025, "level":"Pro-Am club", "competition":"NM i Baseball", "country":"Norway", "team":"Bergen Wet Sox", "league":"NM i Baseball", "g":3, "gs":3, "ab":10, "r":3, "h":7, "doubles":3, "triples":0, "hr":0, "rbi":4, "tb":10, "bb":2, "hbp":0, "so":0, "gdp":0, "sf":0, "sh":0, "sb":3, "cs":0 },
    { "season":2026, "level":"Pro-Am club", "competition":"Regular season", "country":"Norway", "team":"Bergen Wet Sox", "league":"Eliteserien Baseball", "g":10, "gs":10, "ab":28, "r":10, "h":11, "doubles":4, "triples":0, "hr":0, "rbi":6, "tb":15, "bb":9, "hbp":2, "so":8, "gdp":0, "sf":0, "sh":0, "sb":2, "cs":2 },
    { "season":2026, "level":"Pro-Am club", "competition":"NM i Baseball", "country":"Norway", "team":"Bergen Wet Sox", "league":"NM i Baseball", "g":2, "gs":2, "ab":6, "r":1, "h":1, "doubles":0, "triples":0, "hr":1, "rbi":1, "tb":4, "bb":0, "hbp":0, "so":3, "gdp":0, "sf":0, "sh":0, "sb":0, "cs":0 }
  ],

  // w wins, l losses, app appearances, gs starts, sv saves, cg complete games, sho shutouts, ip_outs = innings x 3 (14.2 IP = 44), h, r, er earned runs, bb, so, doubles, triples, hr, ab, wp wild pitches, hb hit batters, bk balks, sfa, sha, go ground outs, fo fly outs, bf batters faced
  pitching: [
    { "season":2020, "level":"College", "competition":"Regular season", "country":"USA", "team":"Southern Virginia University", "league":"CAC (NCAA Division III)", "w":0, "l":0, "app":2, "gs":0, "sv":1, "cg":0, "sho":0, "ip_outs":5, "h":1, "r":2, "er":0, "bb":2, "so":3, "doubles":0, "triples":0, "hr":0, "ab":0, "wp":0, "hb":0, "bk":0, "sfa":0, "sha":0, "bf":11 },
    { "season":2022, "level":"Pro-Am club", "competition":"Regular season", "country":"Norway", "team":"Bergen Wet Sox", "league":"Eliteserien Baseball", "w":1, "l":1, "app":3, "gs":2, "sv":0, "cg":2, "sho":0, "ip_outs":44, "h":20, "r":17, "er":10, "bb":7, "so":17, "doubles":1, "triples":0, "hr":0, "ab":63, "wp":0, "hb":5, "bk":1, "sfa":0, "sha":0, "go":17, "fo":7 },
    { "season":2023, "level":"Pro-Am club", "competition":"Regular season", "country":"Norway", "team":"Bergen Wet Sox", "league":"Eliteserien Baseball", "w":5, "l":3, "app":9, "gs":9, "sv":0, "cg":7, "sho":1, "ip_outs":185, "h":66, "r":52, "er":42, "bb":21, "so":95, "doubles":10, "triples":2, "hr":3, "ab":251, "wp":15, "hb":14, "bk":2, "sfa":0, "sha":0, "go":49, "fo":32 },
    { "season":2023, "level":"Pro-Am club", "competition":"NM i Baseball", "country":"Norway", "team":"Bergen Wet Sox", "league":"NM i Baseball", "w":1, "l":1, "app":2, "gs":2, "sv":0, "cg":1, "sho":0, "ip_outs":27, "h":10, "r":8, "er":5, "bb":2, "so":9, "doubles":1, "triples":0, "hr":0, "ab":39, "wp":3, "hb":0, "bk":0, "sfa":0, "sha":0, "go":9, "fo":8 },
    { "season":2025, "level":"Pro-Am club", "competition":"Regular season", "country":"Norway", "team":"Bergen Wet Sox", "league":"Eliteserien Baseball", "w":2, "l":5, "app":9, "gs":8, "sv":0, "cg":4, "sho":0, "ip_outs":141, "h":60, "r":57, "er":41, "bb":29, "so":34, "doubles":17, "triples":3, "hr":3, "ab":207, "wp":8, "hb":6, "bk":0, "sfa":1, "sha":0, "go":59, "fo":43 },
    { "season":2025, "level":"Pro-Am club", "competition":"NM i Baseball", "country":"Norway", "team":"Bergen Wet Sox", "league":"NM i Baseball", "w":0, "l":1, "app":1, "gs":1, "sv":0, "cg":1, "sho":0, "ip_outs":21, "h":10, "r":10, "er":7, "bb":2, "so":6, "doubles":2, "triples":0, "hr":0, "ab":34, "wp":1, "hb":0, "bk":0, "sfa":1, "sha":0, "go":9, "fo":5 },
    { "season":2026, "level":"Pro-Am club", "competition":"Regular season", "country":"Norway", "team":"Bergen Wet Sox", "league":"Eliteserien Baseball", "w":0, "l":4, "app":5, "gs":3, "sv":0, "cg":2, "sho":0, "ip_outs":70, "h":34, "r":22, "er":17, "bb":12, "so":32, "doubles":7, "triples":1, "hr":1, "ab":101, "wp":3, "hb":1, "bk":0, "sfa":1, "sha":0, "go":15, "fo":15 },
    { "season":2026, "level":"Pro-Am club", "competition":"NM i Baseball", "country":"Norway", "team":"Bergen Wet Sox", "league":"NM i Baseball", "w":1, "l":0, "app":1, "gs":1, "sv":0, "cg":1, "sho":0, "ip_outs":21, "h":6, "r":4, "er":3, "bb":1, "so":14, "doubles":2, "triples":0, "hr":1, "ab":30, "wp":0, "hb":0, "bk":0, "sfa":0, "sha":0, "go":3, "fo":6 }
  ],

  // g games, c chances, po putouts, a assists, e errors, dp double plays, sba stolen bases allowed, csb caught stealing, pb passed balls, ci catcher interference
  fielding: [
    { "season":2018, "level":"College", "competition":"Regular season", "country":"USA", "team":"Southern Virginia University", "league":"CAC (NCAA Division III)", "g":8, "c":6, "po":4, "a":2, "e":0, "dp":0, "sba":0, "csb":0, "pb":0, "ci":0 },
    { "season":2019, "level":"College", "competition":"Regular season", "country":"USA", "team":"Southern Virginia University", "league":"CAC (NCAA Division III)", "g":22, "c":10, "po":10, "a":0, "e":0, "dp":0, "sba":0, "csb":0, "pb":0, "ci":0 },
    { "season":2020, "level":"College", "competition":"Regular season", "country":"USA", "team":"Southern Virginia University", "league":"CAC (NCAA Division III)", "g":14, "c":25, "po":25, "a":0, "e":0, "dp":0, "sba":1, "csb":0, "pb":0, "ci":0 },
    { "season":2022, "level":"Pro-Am club", "competition":"Regular season", "country":"Norway", "team":"Bergen Wet Sox", "league":"Eliteserien Baseball", "g":4, "c":10, "po":4, "a":5, "e":1, "dp":0, "sba":0, "csb":0, "pb":0, "ci":0 },
    { "season":2023, "level":"Pro-Am club", "competition":"Regular season", "country":"Norway", "team":"Bergen Wet Sox", "league":"Eliteserien Baseball", "g":16, "c":53, "po":14, "a":31, "e":8, "dp":3, "sba":0, "csb":0, "pb":0, "ci":0 },
    { "season":2023, "level":"Pro-Am club", "competition":"NM i Baseball", "country":"Norway", "team":"Bergen Wet Sox", "league":"NM i Baseball", "g":2, "c":5, "po":1, "a":4, "e":0, "dp":0, "sba":0, "csb":0, "pb":0, "ci":0 },
    { "season":2024, "level":"Pro-Am club", "competition":"Regular season", "country":"Great Britain", "team":"London Mets", "league":"National Baseball League (NBL)", "g":12, "c":50, "po":45, "a":2, "e":3, "dp":2, "sba":0, "csb":0, "pb":0, "ci":0 },
    { "season":2025, "level":"Pro-Am club", "competition":"Regular season", "country":"Norway", "team":"Bergen Wet Sox", "league":"Eliteserien Baseball", "g":14, "c":40, "po":13, "a":18, "e":9, "dp":1, "sba":1, "csb":0, "pb":0, "ci":0 },
    { "season":2025, "level":"Pro-Am club", "competition":"NM i Baseball", "country":"Norway", "team":"Bergen Wet Sox", "league":"NM i Baseball", "g":3, "c":4, "po":2, "a":2, "e":0, "dp":0, "sba":0, "csb":0, "pb":0, "ci":0 },
    { "season":2026, "level":"Pro-Am club", "competition":"Regular season", "country":"Norway", "team":"Bergen Wet Sox", "league":"Eliteserien Baseball", "g":10, "c":35, "po":24, "a":8, "e":3, "dp":2, "sba":4, "csb":0, "pb":0, "ci":0 },
    { "season":2026, "level":"Pro-Am club", "competition":"NM i Baseball", "country":"Norway", "team":"Bergen Wet Sox", "league":"NM i Baseball", "g":2, "c":4, "po":1, "a":3, "e":0, "dp":0, "sba":0, "csb":0, "pb":0, "ci":0 }
  ]
};
