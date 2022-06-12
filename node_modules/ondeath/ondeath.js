const defaultOptions = {
    SIGINT: true,
    SIGHUP: true,
    SIGQUIT: true,
    SIGTERM: true,
    uncaughtException: true,
    exit: true
};

const callbacks = [];

function exceptionHandler(err) {
    process.stderr.write(`${(new Date).toUTCString()} uncaughtException: ${err.message}\n${err.stack}\n`);

    const exit =
        callbacks
            .filter(callback => callback.uncaughtException == true)
            .map(callback => callback.fn({ exception: err }))
            .reduce((prev, curr) => curr === false ? curr : prev, true);
    if (exit) {
        
        // Remove the exit handler listener, so we don't run stuff multiple times.
        // Otherwise, the exitHandler will run because we do process.exit().
        process.removeListener('exit', exitHandler);
        process.exit(1);
    }

}

function exitHandler(exitCode) {
    callbacks
        .filter(callback => callback.exit == true)
        .forEach(callback => callback.fn({ exitCode }));
}

function signalHandler(signal) {
    const exit =
        callbacks
            .filter(callback => callback[signal] == true)
            .map(callback => callback.fn({ signal }))
            .reduce((prev, curr) => curr === false ? curr : prev, true);
    if (exit) {
        process.removeListener(signal, signalHandlers[signal]);
        process.kill(process.pid, signal);
    }
}

const signalHandlers = {
    SIGINT: () => signalHandler('SIGINT'),
    SIGHUP: () => signalHandler('SIGHUP'),
    SIGQUIT: () => signalHandler('SIGQUIT'),
    SIGTERM: () => signalHandler('SIGTERM')
};

process.on('SIGINT', signalHandlers['SIGINT']);
process.on('SIGHUP', signalHandlers['SIGHUP']);
process.on('SIGQUIT', signalHandlers['SIGQUIT']);
process.on('SIGTERM', signalHandlers['SIGTERM']);
process.on('uncaughtException', exceptionHandler);
process.on('exit', exitHandler);

function onDeath(callback, options) {
    callbacks.push({ ...defaultOptions, ...(options || {}), fn: callback });
}

module.exports = onDeath;