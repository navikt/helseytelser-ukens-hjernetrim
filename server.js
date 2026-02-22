
const hjernetrim = {
  GEOGUESSER: './geoguesser',
  CONNECTIONS: './connections/out',
  WORDLE: 'WORDLE',
};


const weeks = {
  "2026-7" : hjernetrim.GEOGUESSER,
  "2026-8" : hjernetrim.CONNECTIONS,
}

const express = require('express');
const app = express();


app.use("/uke/:key", (req, res, next) => {
  const key = "2026-" + req.params.key;
  const weekPath = weeks[key];

  if (!weekPath || weekPath === undefined) {
    return res.sendFile('missing.html', { root: __dirname });
  }

  const index = getGameRoundIndex(weeks, key);
  res.setHeader('Set-Cookie', `game_round_index=${index}`);
  console.log(`Serving week ${key} with index ${index} from path ${weekPath}`);
  express.static(weekPath)(req, res, next);
});


// Redirect root to current week
app.get("/", (req, res) => {
  res.redirect(`/uke/${getCurrentWeekNumber()}`);
});

function getCurrentWeekNumber() {
  // add 1 day to now, so it lands on sunday
  const now = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  const start = new Date(now.getFullYear(), 0, 1);
  
  // Adjust for Monday as the first day of the week
  // getDay() returns 0 for Sunday, so we convert: Mon=0, Tue=1, ..., Sun=6
  const dayOfWeek = (start.getDay() + 6) % 7;
  
  // Adjust start date to the previous Monday (or keep if already Monday)
  start.setDate(start.getDate() - dayOfWeek);
  
  const diff = now - start;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const weekNumber = Math.floor(diff / oneWeek) + 1;
  
  return weekNumber;
}

function getGameRoundIndex(weeks, key) {
  const weekKeys = Object.keys(weeks);
  const weekPath = weeks[key];
  const currentIndex = weekKeys.indexOf(key);
  let index = 0;
  for (let i = 0; i <= currentIndex; i++) {
    if (weeks[weekKeys[i]] === weekPath) {
      index++;
    }
  }
  return index;
}

// Med express kan vi støtte backend teknologi
// app.post('/api/slack', express.json(), async (req, res) => {
//   // slack stuff
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);