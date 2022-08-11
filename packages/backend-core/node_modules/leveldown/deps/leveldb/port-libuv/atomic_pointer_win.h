#include <stdint.h>
#include <windows.h>

// credit: https://groups.google.com/forum/#!msg/leveldb/VuECZMnsob4/F6pGPGaK-XwJ

namespace leveldb {
namespace port {

class AtomicPointer {
  private:
    void* rep_;

  public:
    AtomicPointer () {}
    explicit AtomicPointer(void* v) {
      InterlockedExchangePointer(&rep_, v);
    }

    // Read and return the stored pointer with the guarantee that no
    // later memory access (read or write) by this thread can be
    // reordered ahead of this read.
    inline void* Acquire_Load() const {
        void* r;
        InterlockedExchangePointer(&r, rep_ );
        return r;
    }

    // Set v as the stored pointer with the guarantee that no earlier
    // memory access (read or write) by this thread can be reordered
    // after this store.
    inline void Release_Store(void* v) {
        InterlockedExchangePointer(&rep_, v);
    }

    // Read the stored pointer with no ordering guarantees.
    inline void* NoBarrier_Load() const {
        void* r = reinterpret_cast<void*>(rep_);
        return r;
    }

    // Set va as the stored pointer with no ordering guarantees.
    inline void NoBarrier_Store(void* v) {
        rep_ = reinterpret_cast<void*>(v);
    }
};

} // namespace port
} // namespace leveldb
