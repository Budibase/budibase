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

#ifndef LEVELDB_PORT_LIBUV_CONVAR_H_
#define LEVELDB_PORT_LIBUV_CONVAR_H_

#include <uv.h>

#ifdef LDB_UV_POSIX
  typedef pthread_cond_t ldb_uv_cond_t;
#endif


UV_EXTERN int ldb_uv_cond_init(ldb_uv_cond_t* cond);
UV_EXTERN void ldb_uv_cond_destroy(ldb_uv_cond_t* cond);
UV_EXTERN void ldb_uv_cond_signal(ldb_uv_cond_t* cond);
UV_EXTERN void ldb_uv_cond_broadcast(ldb_uv_cond_t* cond);
UV_EXTERN void ldb_uv_cond_wait(ldb_uv_cond_t* cond, uv_mutex_t* mutex);
UV_EXTERN int ldb_uv_cond_timedwait(ldb_uv_cond_t* cond, uv_mutex_t* mutex, uint64_t timeout);

#endif  // LEVELDB_PORT_LIBUV_CONVAR_H_
