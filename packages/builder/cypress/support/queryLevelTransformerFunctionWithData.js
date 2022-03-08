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
const stateCodes = 
  {texas: "tx",
  colorado: "co",
  florida: "fl",
  iwoa: "ia",
  louisiana: "la",
  california: "ca",
  pennsylvania: "pa",
  georgia: "ga",
  "new hampshire": "nh",
  virginia: "va",
  michigan: "mi",
  maryland: "md",
  ohio: "oh",
}
const entries = Object.entries(totals)
return entries.map(([state, count]) => 
  {stateCodes[state.toLowerCase()]
  return { state, count, flag: "http://flags.ox3.in/svg/us/${stateCode}.svg" }
})
