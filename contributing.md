# Contributing

If you've come this far, it's because you're interested in contributing to the library. I'm really glad about it. Thanks.
Below you will find more details about the folder structure, branch pattern, and how to make your pull request in the repository.

## Fork and Pull Request

- Fork the `express-rate-limit-core` repository [here](https://github.com/login?return_to=%2FJeffersonGibin%2Fexpress-rate-limiter-core)
- Make a clone of your fork on your computer.

## Branch

Before you start coding consider the following definitions.

- Make sure:
  - that you have forked the official `express-rate-limit-core` repository
  - that you have your fork clone on your computer and that it is synchronized with the official repository.
  - that your 'fork' is up to date with the latest changes from the official repository.
- New branches must be created from the `main` branch of your fork.

### Branch definitions and prefixes

- Bug Fixes: `bugfix/<your-fixe` bug fix
- New Functionality: development of new `feature/<resource>` functionalities
- Refactoring: `refactor/<your-refactoring>` code refactoring
- Urgent fixes: `hotfix/<your-urgent-fixes>` urgent bug fixes

  ```shell
  -> express-rate-limiter-core git:(main): git checkout -b <prefix>/<your-definition-name>
  ```

## Tests

- Unit tests: all implementations must have a unit test.
- Integration test: the `application.spec.ts` file does a test without mocking the library's features, so we can say that this is our integration test.

## Directories

Below you will find the concept of the main application directories.

```
└── express-rate-limit-core/
    └── src/
        ├── app/
        │   ├── dto/
        │   │   ├── arguments-policy.dto.ts
        │   │   └── request-express.dto.ts
        │   ├── application.ts
        │   └── header-request-handler.ts
        ├── core/
        │   ├── calculations
        │   ├── constants
        │   ├── exceptions
        │   ├── interfaces
        │   ├── policies/
        │   │   ├── abstract/
        │   │   │   └── policies.factory.ts
        │   │   ├── rate-limit-per-seconds.policy.ts
        │   │   ├── rate-limit-per-minutes.policy.ts
        │   │   └── rate-limit-per-period.policy.ts
        │   └── validations
        ├── shared/
        │   ├── interfaces
        │   ├── repositories
        │   └── middleware.ts
        └── index.ts
```

- app: represents a layer that uses functionality from the heart of the library.
- core: represents the heart of the library, contains interfaces, validations, policies, and attributes.
- shared: contains everything that will be shared externally.
- index.ts: this file should export everything shared with the outside world.
  - Attention: Externally shared interfaces must not use the `I` prefix.

### Cache Open to Extension

Cache management is open for extension. This means that any developer can implement their own cache management.
as long as it respects the contract defined by the library. This is possible through the `Cache` interface which is stored in `shared/interface/cache.ts`.

### Policy

Every new rate-limit policy must implement the `./core/policies/abstract/rate-limit.policy` abstract interface and must be stored in
`./core/policies`.

## Basic rules

- All interfaces must use the Prefix "I" followed by the name of the interface. Ex: `IYourInterfaceName`
- Try to make use of the concept of `DIP` Dependency inversion. Basically, it says that you should choose to depend on an interface or abstracted types rather than a concrete class.
- Make sure you run a prepush before pushing your changes with the `npm run prepush` command
- Whenever you create interfaces, try to use comments to explain what each attribute represents. That way, when developers hover over an interface, they can find details.
- Don't worry, the `.d.ts` definition file is created automatically.
- Try to follow the `your-file.folder.ts` file conversion
- Try to keep the Readme.md up to date

## End

If you have any questions feel free to open a discussion [here](https://github.com/JeffersonGibin/express-rate-limiter-core/discussions/new).

**It's just for now. Thank you for your interest in contributing to this repository.**
