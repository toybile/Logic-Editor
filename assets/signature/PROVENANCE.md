# Shared Portfolio settings

Source: https://github.com/toybile/toybile.github.io/blob/4a82ca756692e6130f1dd0ae9e559a5edea03034/index.html

Original gesture SHA-256: 6e250580b056576605716f0eca19408a85cf11f5d9d345b18fe17df0327a0b3d

The preserved original is in portfolio-gesture.original.js. hold.js wraps that code with callbacks and adds only a background-selector hook. Timing, cancellation, progress, icons and keyboard behavior are preserved. language-picker.js contains the original Portfolio picker.

Each site bundles these files locally; it does not depend on a remote script or a Gist at runtime. The shared panel exposes interface language and background. Existing project-specific settings remain independent.
