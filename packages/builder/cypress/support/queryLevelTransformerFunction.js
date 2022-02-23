/* eslint-disable */
const breweries = data
const totals = {}

for (let brewery of breweries) 
  {const state = brewery.state
  if (totals[state] == null) 
    {totals[state] = 1
  } else 
    {totals[state]++
  }
}
const entries = Object.entries(totals)
return entries.map(([state, count]) => ({ state, count }))
