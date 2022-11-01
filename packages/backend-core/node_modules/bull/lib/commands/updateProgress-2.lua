--[[
  Update job progress

     Input:
        KEYS[1] Job id key
        KEYS[2] progress event key
      
        ARGV[1] progress
        ARGV[2] event data

      Event:
        progress(jobId, progress)
]]
redis.call("HSET", KEYS[1], "progress", ARGV[1])
redis.call("PUBLISH", KEYS[2], ARGV[2])
