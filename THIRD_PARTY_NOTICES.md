# Third-Party Notices

Puffling is proprietary software, but it uses third-party software under separate licenses. Those licenses apply only to the relevant third-party components and do not convert Puffling's original proprietary code into open-source software.

The server currently declares these direct runtime dependencies in `server/package.json`:

- `pg` — version range `^8.13.1` — MIT License
- `ws` — version range `^8.18.0` — MIT License

Because the repository currently does not contain a dependency lockfile for the server, the exact installed versions and transitive dependency set can vary between installations. A release build should use a committed lockfile and regenerate/verify third-party notices for the exact dependency tree before distribution.

---

## pg / node-postgres

Project: node-postgres (`pg`)
License: MIT
Repository: https://github.com/brianc/node-postgres

Copyright (c) 2010-2020 Brian Carlson (brian.m.carlson@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## ws

Project: `ws`
License: MIT
Repository: https://github.com/websockets/ws

Copyright (c) 2011 Einar Otto Stangvik <einaros@gmail.com>

Copyright (c) 2013 Arnout Kazemier and contributors

Copyright (c) 2016 Luigi Pinca and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Build and hosting services

GitHub, GitHub Actions, GitHub Pages, Render, Neon/PostgreSQL hosting, Apple services, Google services and any other external platform used to build, host or distribute Puffling remain third-party services governed by their own terms. Use of those services does not imply ownership of their software, names, trademarks, or infrastructure.

## Future dependency rule

Before adding a new third-party package, font, image, icon set, music track, sound effect, model, code snippet, template, or other externally sourced asset:

1. identify the original source and author;
2. verify that commercial use is permitted;
3. record the exact license and any attribution requirements;
4. preserve required copyright/license notices;
5. avoid assets with unclear provenance;
6. update this file when the asset is shipped with Puffling.