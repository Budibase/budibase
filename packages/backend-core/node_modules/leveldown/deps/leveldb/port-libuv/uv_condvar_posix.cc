// uv_cond_* backport
// Lifted from the Node 0.9 version of libuv for Node 0.8 compatibility
// https://github.com/joyent/libuv/

// libuv copyright notice:

/* Copyright Joyent, Inc. and other Node contributors. All rights reserved.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to
* deal in the Software without restriction, including without limitation the
* rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
* sell copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
*/

#include <pthread.h>
#include "uv_condvar.h"
#include <stdlib.h> /* abort */
#include <errno.h> /* ETIMEDOUT */

#undef NANOSEC
#define NANOSEC ((uint64_t) 1e9)

#if defined(__APPLE__) && defined(__MACH__)

int ldb_uv_cond_init(ldb_uv_cond_t* cond) {
  if (pthread_cond_init(cond, NULL))
    return -1;
  else
    return 0;
}

#else /* !(defined(__APPLE__) && defined(__MACH__)) */

int ldb_uv_cond_init(ldb_uv_cond_t* cond) {
  pthread_condattr_t attr;

  if (pthread_condattr_init(&attr))
    return -1;

  if (pthread_condattr_setclock(&attr, CLOCK_MONOTONIC))
    goto error2;

  if (pthread_cond_init(cond, &attr))
    goto error2;

  if (pthread_condattr_destroy(&attr))
    goto error;

  return 0;

error:
  pthread_cond_destroy(cond);
error2:
  pthread_condattr_destroy(&attr);
  return -1;
}

#endif /* defined(__APPLE__) && defined(__MACH__) */

void ldb_uv_cond_destroy(ldb_uv_cond_t* cond) {
  if (pthread_cond_destroy(cond))
    abort();
}

void ldb_uv_cond_signal(ldb_uv_cond_t* cond) {
  if (pthread_cond_signal(cond))
    abort();
}

void ldb_uv_cond_broadcast(ldb_uv_cond_t* cond) {
  if (pthread_cond_broadcast(cond))
    abort();
}

void ldb_uv_cond_wait(ldb_uv_cond_t* cond, uv_mutex_t* mutex) {
  if (pthread_cond_wait(cond, mutex))
    abort();
}

#if defined(__APPLE__) && defined(__MACH__)

int ldb_uv_cond_timedwait(ldb_uv_cond_t* cond, uv_mutex_t* mutex, uint64_t timeout) {
  int r;
  struct timeval tv;
  struct timespec ts;
  uint64_t abstime;

  gettimeofday(&tv, NULL);
  abstime = tv.tv_sec * 1e9 + tv.tv_usec * 1e3 + timeout;
  ts.tv_sec = abstime / NANOSEC;
  ts.tv_nsec = abstime % NANOSEC;
  r = pthread_cond_timedwait(cond, mutex, &ts);

  if (r == 0)
    return 0;

  if (r == ETIMEDOUT)
    return -1;

  abort();
  return -1; /* Satisfy the compiler. */
}

#else /* !(defined(__APPLE__) && defined(__MACH__)) */

int ldb_uv_cond_timedwait(ldb_uv_cond_t* cond, uv_mutex_t* mutex, uint64_t timeout) {
  int r;
  struct timespec ts;
  uint64_t abstime;

  abstime = uv_hrtime() + timeout;
  ts.tv_sec = abstime / NANOSEC;
  ts.tv_nsec = abstime % NANOSEC;
  r = pthread_cond_timedwait(cond, mutex, &ts);

  if (r == 0)
    return 0;

  if (r == ETIMEDOUT)
    return -1;

  abort();
  return -1; /* Satisfy the compiler. */
}

#endif /* defined(__APPLE__) && defined(__MACH__) */
