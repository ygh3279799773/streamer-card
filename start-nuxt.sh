  #!/bin/bash

  BUILD_ID=DONTKILLME

  echo "pm2 starting"

  pm2 start ecosystem.config.js --env production

  echo "pm2 started"