// Copyright (c) 2011 The LevelDB Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file. See the AUTHORS file for names of contributors.
//
// See port_example.h for documentation for the following types/functions.

#ifndef STORAGE_LEVELDB_PORT_PORT_LIBUV_H_
#define STORAGE_LEVELDB_PORT_PORT_LIBUV_H_

#undef PLATFORM_IS_LITTLE_ENDIAN
#if defined(OS_MACOSX)
  #include <machine/endian.h>
  #if defined(__DARWIN_LITTLE_ENDIAN) && defined(__DARWIN_BYTE_ORDER)
    #define PLATFORM_IS_LITTLE_ENDIAN \
        (__DARWIN_BYTE_ORDER == __DARWIN_LITTLE_ENDIAN)
  #endif
#elif defined(OS_SOLARIS)
  #include <sys/isa_defs.h>
  #ifdef _LITTLE_ENDIAN
    #define PLATFORM_IS_LITTLE_ENDIAN true
  #else
    #define PLATFORM_IS_LITTLE_ENDIAN false
  #endif
#elif defined(OS_FREEBSD) || defined(OS_OPENBSD) || defined(OS_NETBSD) ||\
      defined(OS_DRAGONFLYBSD) || defined(OS_ANDROID)
  #include <sys/types.h>
  #include <sys/endian.h>
#elif defined(_MSC_VER)
#if _MSC_VER < 1600
  #include "stdint-msvc2008.h"
#endif
  #define PLATFORM_IS_LITTLE_ENDIAN true
#if _MSC_VER < 1900
  #define snprintf _snprintf
#endif
  #define close _close
  #define fread_unlocked _fread_nolock
#else
  #include <endian.h>
#endif

#include <uv.h>

#ifdef SNAPPY
#include <snappy.h>
#endif
#include <stdint.h>
#include <string>
#if defined(_MSC_VER)
  #include "atomic_pointer_win.h"
  #undef small
#else
  #include "port/atomic_pointer.h"
#endif

#ifndef PLATFORM_IS_LITTLE_ENDIAN
#define PLATFORM_IS_LITTLE_ENDIAN (__BYTE_ORDER == __LITTLE_ENDIAN)
#endif

#if defined(OS_MACOSX) || defined(OS_SOLARIS) || defined(OS_FREEBSD) ||\
    defined(OS_NETBSD) || defined(OS_OPENBSD) || defined(OS_DRAGONFLYBSD) ||\
    defined(OS_ANDROID)
// Use fread/fwrite/fflush on platforms without _unlocked variants
#define fread_unlocked fread
#define fwrite_unlocked fwrite
#define fflush_unlocked fflush
#endif

#if defined(OS_MACOSX) || defined(OS_FREEBSD) ||\
    defined(OS_OPENBSD) || defined(OS_DRAGONFLYBSD)
// Use fsync() on platforms without fdatasync()
#define fdatasync fsync
#endif

namespace leveldb {
namespace port {

static const bool kLittleEndian = PLATFORM_IS_LITTLE_ENDIAN;
#undef PLATFORM_IS_LITTLE_ENDIAN

class CondVar;

class Mutex {
 public:
  Mutex();
  ~Mutex();

  void Lock();
  void Unlock();
  void AssertHeld() { }

 private:
  friend class CondVar;
  uv_mutex_t mu_;

  // No copying
  Mutex(const Mutex&);
  void operator=(const Mutex&);
};

class CondVar {
 public:
  explicit CondVar(Mutex* mu);
  ~CondVar();
  void Wait();
  void Signal();
  void SignalAll();
 private:
  uv_cond_t cv_;
  Mutex* mu_;
};

typedef uv_once_t OnceType;
#define LEVELDB_ONCE_INIT UV_ONCE_INIT
extern void InitOnce(OnceType* once, void (*initializer)());

inline bool Snappy_Compress(const char* input, size_t length,
                            ::std::string* output) {
#ifdef SNAPPY
  output->resize(snappy::MaxCompressedLength(length));
  size_t outlen;
  snappy::RawCompress(input, length, &(*output)[0], &outlen);
  output->resize(outlen);
  return true;
#endif

  return false;
}

inline bool Snappy_GetUncompressedLength(const char* input, size_t length,
                                         size_t* result) {
#ifdef SNAPPY
  return snappy::GetUncompressedLength(input, length, result);
#else
  return false;
#endif
}

inline bool Snappy_Uncompress(const char* input, size_t length,
                              char* output) {
#ifdef SNAPPY
  return snappy::RawUncompress(input, length, output);
#else
  return false;
#endif
}

inline bool GetHeapProfile(void (*func)(void*, const char*, int), void* arg) {
  return false;
}

uint32_t AcceleratedCRC32C(uint32_t crc, const char* buf, size_t size);

} // namespace port
} // namespace leveldb

#endif  // STORAGE_LEVELDB_PORT_PORT_LIBUV_H_
