ARG NODE_IMAGE=registry-il2.gravity.spaceforce.mil/chainguard/node@sha256:46d2efcab8b0adbb61c9d2276e40088b673440172119199fb6fd39031a1837af
FROM ${NODE_IMAGE} AS toolchain

USER 0
WORKDIR /workspace
ENV HUSKY=0 \
    CI=true \
    NX_DAEMON=false \
    NX_NO_CLOUD=true \
    NODE_OPTIONS=--no-node-snapshot

RUN apk add --no-cache --upgrade \
        glibc ld-linux glibc-dev glibc-locale-posix nss-db nss-hesiod libcrypt1 python-3.12 \
    && apk add --no-cache glibc-2.44-dev \
    && python3 -c "import math, subprocess; print('Python toolchain ready')" \
    && printf '#include <stdio.h>\nint main() { return 0; }\n' > /tmp/compiler-check.cpp \
    && g++ /tmp/compiler-check.cpp -o /tmp/compiler-check \
    && /tmp/compiler-check

FROM toolchain AS compatibility
COPY . .
RUN node gitlab/prepare-node24.cjs
RUN yarn install --frozen-lockfile --non-interactive
RUN node gitlab/node24-smoke.cjs
RUN yarn build
RUN yarn --cwd packages/shared-core test --runInBand
