# Puma configuration file for Render

# Number of threads per worker
threads_count = ENV.fetch("RAILS_MAX_THREADS", 3).to_i
threads threads_count, threads_count

# Workers: set via WEB_CONCURRENCY.
# - On Render, leave it unset or set to 1 unless you really need multiple workers.
workers ENV.fetch("WEB_CONCURRENCY", 0).to_i

# Preload the app for faster worker spawn (recommended in production with >0 workers)
preload_app! if ENV.fetch("WEB_CONCURRENCY", "0").to_i > 0

# Bind to the correct host/port (Render expects 0.0.0.0)
port ENV.fetch("PORT") { 3000 }
bind "tcp://0.0.0.0:#{ENV.fetch('PORT', 3000)}"

# Allow puma to be restarted by `bin/rails restart`
plugin :tmp_restart

# Run Solid Queue supervisor inside Puma (only if you want jobs handled in the same dyno)
plugin :solid_queue if ENV["SOLID_QUEUE_IN_PUMA"]

# Set PID file only if requested
pidfile ENV["PIDFILE"] if ENV["PIDFILE"]

# Logging tweaks (optional but useful on Render)
stdout_redirect(STDOUT, STDERR, true) if ENV["RAILS_LOG_TO_STDOUT"]
