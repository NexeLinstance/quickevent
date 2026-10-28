# QuickEvent

Tiny standalone browser event emitter.

## Test the release workflow

1. Push all files (including .github/workflows/release-minify.yml) to a new GitHub repo.
2. Wait for Actions to be enabled for the repo (Settings > Actions > allow all).
3. Create and push a tag, then publish a release for it:

   git tag v1.0.0
   git push origin v1.0.0
   gh release create v1.0.0 --title "v1.0.0" --notes "test" --target main

   (Or: Releases > Draft a new release > choose tag v1.0.0 > Publish.)
4. The workflow runs on the published release, minifies src/quickevent.js with Terser into dist/quickevent.min.js, and uploads it as a release asset via the GitHub CLI with GITHUB_TOKEN.
5. Download quickevent.min.js from the release page and test:

   <script src="quickevent.min.js"></script>
   <script>
     QuickEvent.on("ping", (d) => console.log("pong", d));
     QuickEvent.emit("ping", { ok: true });
   </script>

## Local check

npx --yes terser@5 src/quickevent.js -c -m -o dist/quickevent.min.js
