#!/bin/bash
# Start dev server in background
npm run dev &

# Store the process ID
SERVER_PID=$!

# Wait a bit for server to start
sleep 10

# Run the tests
npm run test:functional

# Capture the test result
TEST_RESULT=$?

# Kill the server
kill $SERVER_PID

# Exit with test result
exit $TEST_RESULT
