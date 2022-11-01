--[[
  Promotes a job that is currently "delayed" to the "waiting" state

     Input:
      KEYS[1] 'delayed'
      KEYS[2] 'wait'
      KEYS[3] 'paused'
      KEYS[4] 'priority'

      ARGV[1]  queue.toKey('')
      ARGV[2]  jobId
      ARGV[3]  queue token

     Events:
      'waiting'
]]
local rcall = redis.call;
local jobId = ARGV[2]

if redis.call("ZREM", KEYS[1], jobId) == 1 then
  local priority = tonumber(rcall("HGET", ARGV[1] .. jobId, "priority")) or 0

  local target = KEYS[2];

  if rcall("EXISTS", KEYS[3]) == 1 then
    target = KEYS[3]
  end

  if priority == 0 then
    -- LIFO or FIFO
    rcall("LPUSH", target, jobId)
  else
    -- Priority add
    rcall("ZADD", KEYS[4], priority, jobId)
    local count = rcall("ZCOUNT", KEYS[4], 0, priority)

    local len = rcall("LLEN", target)
    local id = rcall("LINDEX", target, len - (count - 1))
    if id then
      rcall("LINSERT", target, "BEFORE", id, jobId)
    else
      rcall("RPUSH", target, jobId)
    end
  end

  -- Emit waiting event (wait..ing@token)
  rcall("PUBLISH", KEYS[2] .. "ing@" .. ARGV[3], jobId)

  rcall("HSET", ARGV[1] .. jobId, "delay", 0)

  return 0
else
  return -1
end
