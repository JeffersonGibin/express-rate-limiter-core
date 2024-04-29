# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [v2.0.2](https://github.com/JeffersonGibin/express-rate-limiter-core/releases/tag/v2.0.2) [2024-04-28]

### Added
- **Redis Support:** Implementation of rate limit management directly via Redis to enhance scalability and performance.
  - New properties `strategyCache` and `redis` added to the `ISettings` interface.
  - Refer to the [documentation](https://github.com/JeffersonGibin/express-rate-limiter-core?tab=readme-ov-file#features) for more details on how to use these properties.
- Implemented IP address validation and extraction methods in the Ip class
- Added the isIP method to validate whether a given IP address is valid using the node:net module.
- Implemented the getIp method to determine the correct IP address based on the trust settings for a proxy and the X-Forwarded-For header. This method accounts for scenarios where a proxy is trusted and when it is not, appropriately prioritizing the source of the IP address.
- Added Example with Docker

### Changed
- **Custom Cache Configuration:** It is now necessary to add `strategyCache: "CUSTOM"` when using a custom cache.
- Rename the field in the CustomCache interface, which is used in the return type of the Custom Cache interface. The fields now do not have underscores

### Important Notes
- **Incompatibility:** The changes made may affect users who are using previous versions and rely on the default in-memory cache configuration.
  - Users utilizing in-memory cache will not need to make changes to their existing code.
  - Users who implement custom caches will need to adjust their settings to continue functioning correctly.


## [v1.0.1](https://github.com/JeffersonGibin/express-rate-limiter-core/releases/tag/v1.0.1)

### Fixed

- Fixed the unit test (rate-limit-per-period.policy.spec.ts)
- Updated REDME.md

## [v1.0.0](https://github.com/JeffersonGibin/express-rate-limiter-core/releases/tag/v1.0.0)

### Added

- Added rate-limit per seconds
- Added rate-limit per minutes
- Added rate-limit per period
- Added custom block request rule
