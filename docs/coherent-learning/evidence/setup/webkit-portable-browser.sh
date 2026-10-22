#!/bin/sh
# Official Playwright binary with an additive private-library prefix.
# Upstream MiniBrowser wrappers replace LD_LIBRARY_PATH; keep it here instead.
set -eu
bundle=/workspace/aquarium-devtools/playwright/webkit-2336/minibrowser-wpe
export WEBKIT_EXEC_PATH="$bundle/bin"
export WEBKIT_INJECTED_BUNDLE_PATH="$bundle/lib"
export WEBKIT_INSPECTOR_RESOURCES_PATH="$bundle/share"
export LD_LIBRARY_PATH="$bundle/lib:$bundle/sys/lib:/workspace/aquarium-devtools/webkit-portable/root/usr/lib/x86_64-linux-gnu:/workspace/aquarium-devtools/webkit-portable/root/lib/x86_64-linux-gnu:/workspace/aquarium-devtools/webkit-portable/root/usr/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
exec "$bundle/bin/MiniBrowser" "$@"
