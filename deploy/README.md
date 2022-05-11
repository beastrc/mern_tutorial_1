# Legably Production Deployment Readme

## Setup

1. Ensure you have the public `deploy/legably_deploy.pub` and private
   `deploy/legably_deploy`.  The private key will be needed to successfully
   connect to the remote servers for deployment.  The public key is in the
   Repository for storage as it is public by nature.  The private key is not
   in the repository and should only be distributed to users who need to have
   deploy priviliges.

2. Ensure [pm2](https://pm2.keymetrics.io/) is installed locally on the machine 
   of the person doing the deploy. [Quickstart Installation instructions can be
   found on the pm2 website](https://pm2.keymetrics.io/docs/usage/quick-start/) 
   and are also noted below:
   
       $ npm install pm2@latest -g
       # or
       $ yarn global add pm2

3. The user deploying must also have [Git](https://git-scm.com/) installed on
   their machine.  This is somewhat implied by setup #1, but noted here for 
   thoroughness.
   
## Deployment

1. Deployment will happen from the local Legably git repository, so the user
   doing the deployment needs to be in a terminal in the repository working
   directory.  

       $ cd /path/to/legably/production-repo
       
2. Ensure that the local copy of the repository is fully updated with the latest
   code.
   
       $ git pull
       
3. Ensure your local working copy of the repository is clean with not local
   uncommitted changes:
   
       $ git status
       
   This status command should report the following: `nothing to commit, working
   tree clean`.  If not, handle whatever local changes are required manually 
   before deploying.
   
4. Begin the deploy process by including which environment to deploy to
   (staging or production):
   
       $ pm2 deploy ecosystem.config.js <environment>
       # for staging
       $ pm2 deploy ecosystem.config.js staging 
       # for production - NOTE - Not yet implemented on production
       $ pm2 deploy ecosystem.config.js production 
       
       
## Deployment commands

There are a few [deploy commands
documented](https://pm2.keymetrics.io/docs/usage/deployment/#deployment-options)
on the pm2 website and noted here below:

    $ pm2 deploy <configuration_file> <environment> <command>

    Commands:
        setup                run remote setup commands
        update               update deploy to the latest release
        revert [n]           revert to [n]th last deployment or 1
        curr[ent]            output current release commit
        prev[ious]           output previous release commit
        exec|run <cmd>       execute the given <cmd>
        list                 list previous deploy commits
        [ref]                deploy to [ref], the "ref" setting, or latest tag
        
These commands allow you to rollback to specific previous deployments (via the
`revert` command) see which code is currently deployed (via the `current` command)
command, or deploy a specific reference (git tag, branch, commit SHA) other than
the current branch HEAD (via the `[ref]` command)


If a deployment command failed for various reasons (including local changes to
code on the server that aren't in the repository, a previously deployed
reference other than a branch HEAD, etc...), a [force
deployment](https://pm2.keymetrics.io/docs/usage/deployment/#force-deployment)
can be used via the `--force` flag argument.

---

## PM2 Specific notes

Legably servers use pm2 for deployment and for process management of the running
processes in the live environments.  Reading through all the pm2 docs is
advisable to have a good understanding of what capabilities pm2 provides and how
to utilize them.

These "non-deploy" commands should be run locally on the individual server while
SSH'd in as the `deploy` user, not on the users local workstation.  The pm2
daemon that manages the processes on each server runs as the `deploy` user, so
connecting to a server as a different user (such as `ubuntu`, or a user specific
account) will not work as they will not connect to the proper pm2 daemon
connected to the `deploy` user.

You can connect to a server using the same private key used for deploying:

    $ ssh -i ./deploy/legably_deploy deploy@18.218.226.1


* [List pm2 managed process](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#list-managed-applications)

        $ pm2 list
        
* [Monitor pm2
  process](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#terminal-based-dashboard)
  
        $ pm2 monit
        
* [View process logs](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#display-logs)

        $ pm2 logs # for realtime logs
        $ pm2 logs --lines <n> # for older log viewing


* [More commands/options can be found here](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/).
