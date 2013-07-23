Truck
=====

Truck is a deployment management, automation and syncronization application for deploying websites.


Goals
-----

* Environments should be solely defined in configuration, including environment names. This is to
  to better handle special cases where we may want a fourth environment for quality control or user
  testing, as well as to provide a way to run branched code separately.
* It should only require a minimal set of dependencies so it can used easily on most linux platforms.
* Handling multiple servers should be part of the core functionality.


Configuration Concepts
----------------------

Configuration really breaks down into:

* Defining environments,
* Defining origins (places where truck will be pulling from),
* Defining hosts (places where truck will be putting stuff), and
* Some global settings.

Our traditional Patton installation looks like

* Environments:
  * dev
  * stage
  * prod
* Origins:
  * code from SVN
  * content from Database
  * content from the configured source environment (typically prod)
* Hosts:
  * localhost - we run Patton on the target server.

On Steamship, which needed a fourth environment for testing, it looks like

* Environments:
  * dev
  * test
  * stage
  * prod
* Origins:
  * code from SVN
  * content from Database
  * content from the configured source environment (typically prod)
* Hosts:
  * localhost - we run Patton on the target server.


Deployment Phases
-------------

1. **validate** - verify that the environment/origin/host are all valid.
2. **export** - during this phase, we do two things:
   + We update the code from VCS to match the target revision
   + We export content from the content source and copy it to the destination
3. **migrate** - during this phase, we run any migration scripts. Right now, all SQL migration
   scripts are run first, then any shell scripts. Right now, SQL scripts are only run once, while
   shell scripts are run once per server.
4. **replace** - during this phase, both code and content is 'hot swapped' (as best we can.)
5. **cleanup** - remove any temporarily files.
