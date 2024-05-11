![Id image](https://github.com/the-minimal/id/blob/main/docs/the-minimal-id.jpg?raw=true)

# Highlights 

- Small (~ 700 bytes)
- Low runtime overhead
- Cryptographically correct `random`
- Multiple entropy sources
    - Fingerprint
        - Uses [@the-minimal/fingerprint](https://github.com/the-minimal/fingerprint)
        - Hashed using SHA-512
        - Random 32 byte slice
    - Counter
        - Random start value
        - Maximum of `4_294_967_295` values
    - Timestamp
        - 64 byte timestamp with millisecond precision
    - Salt
        - 52 bytes of random 8-bit values
    - External data
        - Data not provided 
            - 32 bytes of random 8-bit values
        - Data is provided
            - Hashed using SHA-512
            - Random 32 byte slice
- Variable length
    - Entropy sources are saved into 128 byte array
    - The byte array is hashed using SHA-512
    - The hash is converted into Base36 string
    - The Base36 string is randomly sliced into desired length 
    - Default length is 24
- Collision-resistant
    - `5.58e18` until 50% chance of collision
- Uniform and URL-friendly output
    - `~0.005%` character variance
- Async / Non-blocking
- 100% test coverage

# API

## `init`

Initializes a new instance of ID generator.

```ts
const createId8 = init({ length: 8 });
```

## `createId`

Creates a random ID of length 24.

It accepts optional external data which is used as another source of entropy.

```ts
const userId = createId(userEmail);
```

# Credits

This library is directly based on Cuid2.
