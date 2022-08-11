#include <v8.h>
#include <node.h>
#include <node_buffer.h>
#include <node_version.h>

#include <zlib.h>
#include <cstring>
#include <cstdlib>

using namespace v8;
using namespace node;

// node v0.2.x compatibility
#if NODE_VERSION_AT_LEAST(0,3,0)
    #define Buffer_Data Buffer::Data
    #define Buffer_Length Buffer::Length
    #define Buffer_New Buffer::New
#else
    inline char* Buffer_Data(Handle<Object> obj) {
        return (ObjectWrap::Unwrap<Buffer>(obj))->data();
    }
    inline size_t Buffer_Length(Handle<Object> obj) {
        return (ObjectWrap::Unwrap<Buffer>(obj))->length();
    }
    inline Buffer* Buffer_New(char* data, size_t length) {
        Buffer* buffer = Buffer::New(length);
        memcpy(buffer->data(), data, length);
        return buffer;
    }
#endif


z_stream deflate_s;
z_stream inflate_s;

inline Handle<Value> ZLib_error(const char* msg = NULL) {
    return ThrowException(Exception::Error(
        String::New(msg ? msg : "Unknown Error")));
}

#define ZLib_Xflate(x, factor)                                                 \
Handle<Value> ZLib_##x##flate(const Arguments& args) {                         \
    HandleScope scope;                                                         \
                                                                               \
    if (args.Length() < 1 || !Buffer::HasInstance(args[0])) {                  \
        return ZLib_error("Expected Buffer as first argument");                \
    }                                                                          \
                                                                               \
    if ((x##flateReset(&x##flate_s)) != Z_OK) {                                \
        assert((false, "ZLib stream is beyond repair"));                       \
    }                                                                          \
                                                                               \
    Local<Object> input = args[0]->ToObject();                                 \
    x##flate_s.next_in = (Bytef*)Buffer_Data(input);                           \
    int length = x##flate_s.avail_in = Buffer_Length(input);                   \
                                                                               \
    int ret;                                                                   \
    char* result = NULL;                                                       \
                                                                               \
    int compressed = 0;                                                        \
    do {                                                                       \
        result = (char*)realloc(result, compressed + factor * length);         \
        if (!result) return ZLib_error("Could not allocate memory");           \
                                                                               \
        x##flate_s.avail_out = factor * length;                                \
        x##flate_s.next_out = (Bytef*)result + compressed;                     \
                                                                               \
        ret = x##flate(&x##flate_s, Z_FINISH);                                 \
        if (ret != Z_STREAM_END && ret != Z_OK && ret != Z_BUF_ERROR) {        \
            free(result);                                                      \
            return ZLib_error(x##flate_s.msg);                                 \
        }                                                                      \
                                                                               \
        compressed += (factor * length - x##flate_s.avail_out);                \
    } while (x##flate_s.avail_out == 0);                                       \
                                                                               \
    Buffer* output = Buffer_New(result, compressed);                           \
    free(result);                                                              \
    return scope.Close(Local<Value>::New(output->handle_));                    \
}

ZLib_Xflate(de, 1);
ZLib_Xflate(in, 2);

extern "C" void init (Handle<Object> target) {
    deflate_s.zalloc = inflate_s.zalloc = Z_NULL;
    deflate_s.zfree  = inflate_s.zfree  = Z_NULL;
    deflate_s.opaque = inflate_s.opaque = Z_NULL;

    deflateInit(&deflate_s, Z_DEFAULT_COMPRESSION);
    inflateInit(&inflate_s);

    NODE_SET_METHOD(target, "deflate", ZLib_deflate);
    NODE_SET_METHOD(target, "inflate", ZLib_inflate);
}
