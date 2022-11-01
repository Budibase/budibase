--[[
  Move job from active to a finished status (completed or failed)
  A job can only be moved to completed if it was active.
  The job must be locked before it can be moved to a finished status,
  and the lock must be released in this script.

     Input:
      KEYS[1] active key
      KEYS[2] completed/failed key
      KEYS[3] jobId key

      KEYS[4] wait key
      KEYS[5] priority key
      KEYS[6] active event key

      KEYS[7] delayed key
      KEYS[8] stalled key

      KEYS[9] metrics key

      ARGV[1]  jobId
      ARGV[2]  timestamp
      ARGV[3]  msg property
      ARGV[4]  return value / failed reason
      ARGV[5]  token
      ARGV[6]  shouldRemove
      ARGV[7]  event data (? maybe just send jobid).
      ARGV[8]  should fetch next job
      ARGV[9]  base key
      ARGV[10] lock token
      ARGV[11] lock duration in milliseconds
      ARGV[12] maxMetricsSize

     Output:
      0 OK
      -1 Missing key.
      -2 Missing lock.

     Events:
      'completed/failed'
]]
local rcall = redis.call

--[[
  Functions to collect metrics based on a current and previous count of jobs.
  Granualarity is fixed at 1 minute.
]]
local function collectMetrics(metaKey, dataPointsList, maxDataPoints, timestamp)
    -- Increment current count
    local count = rcall("HINCRBY", metaKey, "count", 1) - 1

    -- Compute how many data points we need to add to the list, N.
    local prevTS = rcall("HGET", metaKey, "prevTS")

    if not prevTS then
        -- If prevTS is nil, set it to the current timestamp
        rcall("HSET", metaKey, "prevTS", timestamp, "prevCount", 0)
        return
    end

    local N = math.floor((timestamp - prevTS) / 60000)

    if N > 0 then
        local delta = count - rcall("HGET", metaKey, "prevCount")
        -- If N > 1, add N-1 zeros to the list
        if N > 1 then
            local points = {}
            points[1] = delta
            for i = 2, N do points[i] = 0 end
            rcall("LPUSH", dataPointsList, unpack(points))
        else
            -- LPUSH delta to the list
            rcall("LPUSH", dataPointsList, delta)
        end

        -- LTRIM to keep list to its max size
        rcall("LTRIM", dataPointsList, 0, maxDataPoints - 1)

        -- update prev count with current count
        rcall("HSET", metaKey, "prevCount", count, "prevTS", timestamp)
    end
end

if rcall("EXISTS", KEYS[3]) == 1 then -- // Make sure job exists
    if ARGV[5] ~= "0" then
        local lockKey = KEYS[3] .. ':lock'
        if rcall("GET", lockKey) == ARGV[5] then
            rcall("DEL", lockKey)
            rcall("SREM", KEYS[8], ARGV[1])
        else
            return -2
        end
    end

    -- Remove from active list
    rcall("LREM", KEYS[1], -1, ARGV[1])

    -- Remove job?
    local keepJobs = cmsgpack.unpack(ARGV[6])
    local maxCount = keepJobs['count']
    local maxAge = keepJobs['age']
    local targetSet = KEYS[2]
    local timestamp = ARGV[2]

    if maxCount ~= 0 then

        -- Add to complete/failed set
        rcall("ZADD", targetSet, timestamp, ARGV[1])
        rcall("HMSET", KEYS[3], ARGV[3], ARGV[4], "finishedOn", timestamp) -- "returnvalue" / "failedReason" and "finishedOn"

        local function removeJobs(jobIds)
            for i, jobId in ipairs(jobIds) do
                local jobKey = ARGV[9] .. jobId
                local jobLogKey = jobKey .. ':logs'
                rcall("DEL", jobKey, jobLogKey)
            end
        end

        -- Remove old jobs?
        if maxAge ~= nil then
            local start = timestamp - maxAge * 1000
            local jobIds = rcall("ZREVRANGEBYSCORE", targetSet, start, "-inf")
            removeJobs(jobIds)
            rcall("ZREMRANGEBYSCORE", targetSet, "-inf", start)
        end

        if maxCount ~= nil and maxCount > 0 then
            local start = maxCount
            local jobIds = rcall("ZREVRANGE", targetSet, start, -1)
            removeJobs(jobIds)
            rcall("ZREMRANGEBYRANK", targetSet, 0, -(maxCount + 1));
        end
    else
        local jobLogKey = KEYS[3] .. ':logs'
        rcall("DEL", KEYS[3], jobLogKey)
    end

    -- Collect metrics
    if ARGV[12] ~= "" then
      collectMetrics(KEYS[9], KEYS[9]..':data', ARGV[12], timestamp)
    end

    rcall("PUBLISH", targetSet, ARGV[7])

    -- Try to get next job to avoid an extra roundtrip if the queue is not closing, 
    -- and not rate limited.
    if (ARGV[8] == "1") then
        -- move from wait to active 
        local jobId = rcall("RPOPLPUSH", KEYS[4], KEYS[1])
        if jobId then
            local jobKey = ARGV[9] .. jobId
            local lockKey = jobKey .. ':lock'

            -- get a lock
            rcall("SET", lockKey, ARGV[11], "PX", ARGV[10])

            rcall("ZREM", KEYS[5], jobId) -- remove from priority
            rcall("PUBLISH", KEYS[6], jobId)
            rcall("HSET", jobKey, "processedOn", ARGV[2])

            return {rcall("HGETALL", jobKey), jobId} -- get job data
        end
    end

    return 0
else
    return -1
end
