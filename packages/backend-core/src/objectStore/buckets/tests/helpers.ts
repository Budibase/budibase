import env from "../../../environment"
import path from "path"

export function withS3() {
  env._set("NODE_ENV", "production")
  env._set("MINIO_ENABLED", 0)
  env._set("MINIO_URL", "http://s3.example.com")
  env._set("CLOUDFRONT_CDN", undefined)
}

export function withCloudfront() {
  withS3()
  env._set("CLOUDFRONT_CDN", "http://cf.example.com")
  env._set("CLOUDFRONT_PUBLIC_KEY_ID", "keypair_123")
  // path to the fake key in test dir
  env._set(
    "CLOUDFRONT_PRIVATE_KEY_PATH",
    path.resolve(process.cwd(), "src/objectStore/buckets/tests/key.pem")
  )
}

export function withMinio() {
  env._set("NODE_ENV", "production")
  env._set("MINIO_ENABLED", 1)
  env._set("MINIO_URL", "http://minio.example.com")
  env._set("CLOUDFRONT_CDN", undefined)
}
