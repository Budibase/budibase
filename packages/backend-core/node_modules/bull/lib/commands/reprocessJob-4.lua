--[[
  Attempts to reprocess a job

  Input:
    KEYS[1] job key
    KEYS[2] job lock key
    KEYS[3] job state
    KEYS[4] wait key

    ARGV[1] job.id,
    ARGV[2] (job.opts.lifo ? 'R' : 'L') + 'PUSH'
    ARGV[3] token
    ARGV[4] timestamp

  Output:
    1 means the operation was a success
    0 means the job does not exist
    -1 means the job is currently locked and can't be retried.
    -2 means the job was not found in the expected set.


]]
if (redis.call("EXISTS", KEYS[1]) == 1) then
  if (redis.call("EXISTS", KEYS[2]) == 0) then
    redis.call("HDEL", KEYS[1], "finishedOn", "processedOn", "failedReason")
    redis.call("HSET", KEYS[1], "retriedOn", ARGV[4])

    if (redis.call("ZREM", KEYS[3], ARGV[1]) == 1) then
      redis.call(ARGV[2], KEYS[4], ARGV[1])

      -- Emit waiting event (wait..ing@token)
      redis.call("PUBLISH", KEYS[4] .. "ing@" .. ARGV[3], ARGV[1])
      return 1
    else
      return -2
    end
  else
    return -1
  end
else
  return 0
end
