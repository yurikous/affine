# AFFiNE Migration Testings

This package is used to testing migration logic for every breaking version.

```sh
BUILD_TYPE=canary yarn run build
cd tests/affine-migration
yarn run e2e
```

> Tips:
> Run `yarn dev` to start dev server in 8080 could make debugging more quickly.
