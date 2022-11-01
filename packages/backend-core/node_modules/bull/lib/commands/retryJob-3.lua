--[[
  Retries a failed job by moving it back to the wait queue.

    Input:
      KEYS[1] 'active',
      KEYS[2] 'wait'
      KEYS[3] jobId

      ARGV[1]  pushCmd
      ARGV[2]  jobId
      ARGV[3]  token

    Events:
      'prefix:added'

    Output:
     0  - OK
     -1 - Missing key
     -2 - Job Not locked
]]
if redis.call("EXISTS", KEYS[3]) == 1 then

  -- Check for job lock
  if ARGV[3] ~= "0" then
    local lockKey = KEYS[3] .. ':lock'
    local lock = redis.call("GET", lockKey)
    if redis.call("GET", lockKey) ~= ARGV[3] then
      return -2
    end
  end

  redis.call("LREM", KEYS[1], 0, ARGV[2])
  redis.call(ARGV[1], KEYS[2], ARGV[2])

  return 0
else
  return -1
end
