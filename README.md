# GoByte Ninja Front-End (gobyteninja-fe)
Forked from dashninja-fe By Alexandre (aka elbereth) Devilliers

Check the running live website at [https://masternodes.gobyte.network]

This is part of what makes the GoByte Ninja monitoring application.
It contains:
- Public REST API (using PHP and Phalcon framework)
- Public web pages (using static HTML5/CSS/Javascript)

Feel free to donate to : GQ9w7ojnrEL286oZsxAQ9gfjQfGFmMoh1m

Special thanks to : [Jetbrains](https://www.jetbrains.com)

## Requirement:
* You will need a running website, official at https://masternodes.gobyte.network uses nginx

For the REST API:
* PHP v5.6 with mysqli (works/tested with PHP 7.1)
* Phalcon v2.0.x (should work with any version) up to v3.2.x
* MySQL database with GoByte Ninja Database (check gobyteninja-db repository)

## Optional:
* GoByte Ninja Control script installed and running (to have a populated database)

## Install:
* Go to the root of your website for GoByte monitoring (ex: cd /home/gobyteninja2/www/)
* Get latest code from github:
```shell
git clone https://github.com/gobytecoin/gobyteninja-fe
.git
```

* Configure php to answer only to calls to api/index.php rewriting to end-point api/

* Add api/cron.php script to your crontab, activate for main and/or test net, both for blocks24h and for masternode full list

## Configuration:
* Todo...
