--[[
  Attempts to retry all failed jobs

  Input:
    KEYS[1] base key
    KEYS[2] failed state key
    KEYS[3] wait state key

    ARGV[1]  count

  Output:
    1  means the operation is not completed
    0  means the operation is completed
]]
local baseKey = KEYS[1]
local maxCount = tonumber(ARGV[1])

local rcall = redis.call;

local function batches(n, batchSize)
  local i = 0

  return function()
    local from = i * batchSize + 1
    i = i + 1
    if (from <= n) then
      local to = math.min(from + batchSize - 1, n)
      return from, to
    end
  end
end

local function getZSetItems(keyName, max)
  return rcall('ZRANGE', keyName, 0, max - 1)
end

local jobs = getZSetItems(KEYS[2], maxCount)

if (#jobs > 0) then
  for i, key in ipairs(jobs) do
    local jobKey = baseKey .. key
    rcall("HDEL", jobKey, "finishedOn", "processedOn", "failedReason")
  end

  for from, to in batches(#jobs, 7000) do
    rcall("ZREM", KEYS[2], unpack(jobs, from, to))
    rcall("LPUSH", KEYS[3], unpack(jobs, from, to))
  end
end

maxCount = maxCount - #jobs

if(maxCount <= 0) then
  return 1
end

return 0
