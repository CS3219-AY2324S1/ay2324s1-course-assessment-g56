#!/bin/bash
set -Ex

function apply_path {
    # envs=("SUPABASE_URL", "SUPABASE_ANON_KEY", "FRONTEND_SERVICE", "QUESTION_PATH", "USER_PATH", "MATCHING_PATH")
    envs="${!RUNTIME_@}"

    for env in ${envs}; do
        test -n "${!env}" &&
        find /app \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_$env#${!env}#g"
    done
}

apply_path
echo "Starting Nextjs"
exec "$@"