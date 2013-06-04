Truck
=====

Truck is a replacement for Patton.


Goals
-----

My goals with Truck are

+ environments should be arbitrary and arbitrarily named. Relationships between environments should
  be defined only in configuration.
+ It shouldn't require any totally insane dependencies, and should be able to run as a fairly
  self-contained thing.
+ It should be **great** at multi-server stuff. In fact, I want to code multi-server first, and
  worry about single server second.


Configuration Concepts
----------------------

Configuration really breaks down into:

+ Defining the list of managed environments and
+ Defining content sources for the environments.

Our traditional Patton installation looks like

+ DEV 
  + code from SVN
  + content from PROD
+ STAGE
  + code from SVN
  + content from PROD
+ PROD
  + code from STAGE
  + content is canonical

During development, it might look like

+ DEV 
  + code from SVN
  + content is canonical
+ STAGE
  + code from SVN
  + content from DEV
+ PROD
  + code from STAGE
  + content from DEV

On Steamship, which needed a fourth environment for testing, it looks like

+ DEV 
  + code from SVN
  + content from PROD
+ TEST
  + code from SVN
  + content is either canonical OR a subset of PROD
+ STAGE
  + code from TEST
  + content from PROD
+ PROD
  + code from STAGE
  + content is canonical

Once we get into multiple servers, we should also consider what is part of each environment. For
example, on Steamship

+ DEV
  + 2 web servers: webdev, websql
  + 1 database: websql
+ TEST
  + 2 web servers: webdev, websql
  + 1 database: websql
+ STAGE
  + 3 web servers: www1, www2, www3
  + 1 database: postgresl0
+ PROD
  + 3 web servers: www1, www2, www3
  + 1 database: postgreesl0

But for RSA Conference, there's

+ DEV
  + 1 web server: dev
  + 1 database: dev
+ UAT
  + 1 web server: dev
  + 1 database: dev
+ PROD
  + 1 web server: www1 (technically there's a second, but they're using NFS)
  + 1 database: db


Patton Phases
-------------

Patton proceeds through the following phases while deploying:

1. **export** - during this phase, we do two things:
   + We update the code from VCS to match the target revision
   + We export content from the content source and copy it to the destination
2. **migrate** - during this phase, we run any migration scripts. Right now, all SQL migration
   scripts are run first, then any shell scripts. Right now, SQL scripts are only run once, while
   shell scripts are run once per server.
3. **replace** - during this phase, both code and content is 'hot swapped' (as best we can.)

For multi-server deployments, each phase is done asynchronously on every applicable server, and then
the Patton re-syncronizes after each phase.

Patton also support hooks before, in between, and after these phases.
