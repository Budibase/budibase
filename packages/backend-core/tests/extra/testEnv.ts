import env from "../../src/environment"
import * as context from "../../src/context"
import * as structures from "../core/utilities/structures"

// TENANCY

export async function withTenant(task: (tenantId: string) => any) {
  const tenantId = structures.tenant.id()
  return context.doInTenant(tenantId, async () => {
    await task(tenantId)
  })
}

export function singleTenant() {
  env._set("MULTI_TENANCY", 0)
}

export function multiTenant() {
  env._set("MULTI_TENANCY", 1)
}

export function selfHosted() {
  env._set("SELF_HOSTED", 1)
}

export function cloudHosted() {
  env._set("SELF_HOSTED", 0)
}

// NODE

export function nodeDev() {
  env._set("NODE_ENV", "dev")
}

export function nodeJest() {
  env._set("NODE_ENV", "jest")
}

// FILES

export function withS3() {
  env._set("NODE_ENV", "production")
  env._set("MINIO_ENABLED", 0)
  env._set("MINIO_URL", "http://s3.example.com")
  env._set("CLOUDFRONT_CDN", undefined)
}

const CLOUDFRONT_TEST_KEY =
  "-----BEGIN RSA PRIVATE KEY-----\n" +
  "MIIEpAIBAAKCAQEAqXRsir/0Qba1xEnybUs7d7QEAE02GRc+4H7HD5l5VnAxkV1m\n" +
  "tNTXTmoYkaIhLdebV1EwQs3T9knxoyd4cVcrDkDfDLZErfYWJsuE3/QYNknnZs4/\n" +
  "Ai0cg+v9ZX3gcizvpYg9GQI3INM0uRG8lJwGP7FQ/kknhA2yVFVCSxX6kkNtOUh5\n" +
  "dKSG7m6IwswcSwD++Z/94vsFkoZIGY0e1CD/drFJ6+1TFY2YgbDKT5wDFLJ9vHFx\n" +
  "/5o4POwn3gz/ru2Db9jbRdfEAqRdy46nRKQgBGUmupAgSK1+BJEzafexp8RmCGb0\n" +
  "WUffxOtj8/jNCeCF0JBgVHAe3crOQ8ySrtoaHQIDAQABAoIBAA+ipW07/u6dTDI7\n" +
  "XHoHKgqGeqQIe8he47dVG0ruL0rxeTFfe92NkfwzP+cYHZWcQkIRRLG1Six8cCZM\n" +
  "uwlCML/U7n++xaGDhlG4D5+WZzGDKi3LM/cgcHQfrzbRIYeHa+lLI9AN60ZFFqVI\n" +
  "5KyVpOH1m3KLD3FYzi6H22EQOxmJpqWlt2uArny5LxlPJKmmGSFjvneb4N2ZAKGQ\n" +
  "QfClJGz9tRjceWUUdJrpqmTmBQIosKmLPq8PEviUNAVG+6m4r8jiRbf8OKkAm+3L\n" +
  "LVIsN8HfYB9jEuERYPnbuXdX0kDEkg0xEyTH5YbNZvfm5ptCU9Xn+Jz1trF+wCHD\n" +
  "2RlxdQUCgYEA3U0nCf6NTmmeMCsAX6gvaPuM0iUfUfS3b3G57I6u46lLGNLsfJw6\n" +
  "MTpVc164lKYQK9czw/ijKzb8e3mcyzbPorVkajMjUCNWGrMK+vFbOGmqQkhUi30U\n" +
  "IJuuTktMd+21D/SpLlev4MLria23vUIKEqNenYpV6wkGLt/mKtISaPMCgYEAxAYx\n" +
  "j+xJLTK9eN+rpekwjYE78hD9VoBkBnr/NBiGV302AsJRuq2+L4zcBnAsH+SidFim\n" +
  "cwqoj3jeVT8ZQFXlK3fGVaEJsCXd6GWk8ZIWUTn9JZwi2KcCvCU/YiHfx8c7y7Gl\n" +
  "SiPXUPsvvkcw6RRh2u4J5tHLIqJe3W58ENoBNK8CgYEApxTBDMKrXTBQxn0w4wfQ\n" +
  "A6soPuDYLMBeXj226eswD6KZmDxnYA1zwgcQzPIO2ewm+XKZGrR2PQJezbqbrrHL\n" +
  "QkVBcwz49GA5eh8Dg0MGZCki6rhBXK8qqxPfHi2rpkBKG6nUsbBykXeY7XHC75kU\n" +
  "kc3WeYsgIzvE908EMAA69hECgYEAinbpiYVZh1DBH+G26MIYZswz4OB5YyHcBevZ\n" +
  "2x27v48VmMtUWe4iWopAXVfdA0ZILrD0Gm0b9gRl4IdqudQyxgqcEZ5oLoIBBwjN\n" +
  "g0oy83tnwqpQvwLx3p7c79+HqCGmrlK0s/MvQ+e6qMi21t1r5e6hFed5euSA6B8E\n" +
  "Cg9ELMcCgYB9bGwlNAE+iuzMIhKev1s7h3TzqKtGw37TtHXvxcTQs3uawJQksQ2s\n" +
  "K0Zy1Ta7vybbwAA5m+LxoMT04WUdJO7Cr8/3rBMrbKKO3H7IgC3G+nXnOBdshzn5\n" +
  "ifMbhZslFThC/osD5ZV7snXZgTWyPexaINJhHmdrAWpmW1h+UFoiMw==\n" +
  "-----END RSA PRIVATE KEY-----\n"

const CLOUDFRONT_TEST_KEY_64 = Buffer.from(
  CLOUDFRONT_TEST_KEY,
  "utf-8"
).toString("base64")

export function withCloudfront() {
  withS3()
  env._set("CLOUDFRONT_CDN", "http://cf.example.com")
  env._set("CLOUDFRONT_PUBLIC_KEY_ID", "keypair_123")
  env._set("CLOUDFRONT_PRIVATE_KEY_64", CLOUDFRONT_TEST_KEY_64)
}

export function withMinio() {
  env._set("NODE_ENV", "production")
  env._set("MINIO_ENABLED", 1)
  env._set("MINIO_URL", "http://minio.example.com")
  env._set("CLOUDFRONT_CDN", undefined)
}
