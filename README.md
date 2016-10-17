# distrib-logger
Distributed Servers logs &amp; stats collector using zmq &amp; appmetrics using node.js

## The Problem
Biggest problem with distributed system is monitoring of your app running in it &amp; centralization of application logs.

So to solve this problem, I created this mini project, which uses zmq as an communication layer and appmetrics to collect the health of the application.

## Features
* Dymanic addition of servers.
* Realtime health stat dashboard.
* Dead app notification.
