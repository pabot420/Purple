onDeath()
=========

Syntax: `onDeath(callbackFn, options);`

The `callbackFn` will run just before the Node.js process exits.

The options
-----------

The options object is by default:

```
{
    SIGINT: true,
    SIGHUP: true,
    SIGQUIT: true,
    SIGTERM: true,
    uncaughtException: true,
    exit: true
}
```

You can override the defaults:

```
// Override uncaughtException:
onDeath(myCleanUpFn, { uncaughtException: false });
```

Abort program termination
-------------------------

The `callbackFn` can abort program termination by returning `false`, if the termination was triggered by
`SIGINT`, `SIGHUP`, `SIGQUIT`, `SIGTERM` or an unhandled exception. In other cases, it is not possible to
abort program termination.

Note! ALL your callbacks WILL run when the program is about to terminate. If your first callback returns
`false`, the other callbacks will still run. Then, program termination is aborted after all callbacks has
finished.

Regarding asynchronous clean up functions
-----------------------------------------

If you have asynchronous clean up jobs, you could return `false` to abort program termination, and then do a
`process.exit()` yourself when your asynch jobs are finished. However, as stated above, it is not always
possible to abort program termination.

