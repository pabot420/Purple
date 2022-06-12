#!/bin/bash

TMPFILE="$(mktemp)"
pushd "$(dirname $0)" >/dev/null

node <<_EOF_ >"$TMPFILE"
    const onDeath = require('../ondeath');
    onDeath(() => console.log('A'));
_EOF_
if [ "$(cat $TMPFILE)" != "A" ]; then
    echo "It should run when nohing more in event queue!"
    exit 1
fi
rm "$TMPFILE"

node <<_EOF_ >"$TMPFILE"
    const onDeath = require('../ondeath');
    onDeath(() => console.log('A'), { exit: false });
_EOF_
if [ "$(cat $TMPFILE)" != "" ]; then
    echo "It should not run when even queue is empty, if the exit option is false!"
    exit 1

fi
rm "$TMPFILE"

for SIGNAL in INT QUIT TERM HUP; do

    node <<_EOF_ >"$TMPFILE" &
        const onDeath = require('../ondeath');
        onDeath(() => console.log('A'), { SIG$SIGNAL: true} );
        setTimeout(() => console.log('B'), 10000);
_EOF_
    PID="$!"
    sleep 1
    kill -s $SIGNAL $PID
    if [ "$(cat $TMPFILE)" != "A" ]; then
        echo "It should run on SIG$SIGNAL!"
        exit 1
    fi
    if ps -p $PID > /dev/null; then
        echo "Process did not die on SIG$SIGNAL!"
        exit 1
    fi
    rm "$TMPFILE"

    node <<_EOF_ >"$TMPFILE" &
        const onDeath = require('../ondeath');
        onDeath(() => console.log('A'), { SIG$SIGNAL: false });
        setTimeout(() => console.log('B'), 3000);
_EOF_
    PID="$!"
    sleep 1
    kill -s $SIGNAL $PID
    if [ "$(cat $TMPFILE)" != "" ]; then
        echo "It should not run on SIG$SIGNAL if SIG$SIGNAL option is false!"
        exit 1
    fi
    if ps -p $PID > /dev/null; then
        echo "Process did not die on SIG$SIGNAL - after no callbacks ran!"
        exit 1
    fi
    rm "$TMPFILE"

   node <<_EOF_ >"$TMPFILE" &
        const onDeath = require('../ondeath');
        onDeath(() => false, { SIG$SIGNAL: true });
        setTimeout(() => {}, 10000);
_EOF_
    PID="$!"
    sleep 1
    kill -s $SIGNAL $PID
    if ps -p $PID > /dev/null; then
        kill -KILL $PID
    else
        echo "Process died when not supposed to, on SIG$SIGNAL"
        exit 1
    fi
    rm "$TMPFILE"

done

node <<_EOF_ >"$TMPFILE" 2>&1
    const onDeath = require('../ondeath');
    onDeath(() => console.log('This should run once'), {});
    onDeath(() => console.log('This should not run'), { uncaughtException: false });
    JSON.parse('F A I L')
_EOF_
if [ "$(cat $TMPFILE | grep 'This should run once' | wc -l | sed -E 's/ //g')" != "1" ]; then
    echo "The callbacks ran too many times!"
    exit 1
fi
if [ "$(cat $TMPFILE | grep 'This should not run' | wc -l | sed -E 's/ //g')" != "0" ]; then
    echo "Callback should not run on uncaught exception, if uncaughtException is false!"
    exit 1
fi
if [ "$(cat $TMPFILE | grep 'SyntaxError: Unexpected token F in JSON at position 0' | wc -l | sed -E 's/ //g')" != "1" ]; then
    echo "Wrong reason why we got an unhandled exception!"
    exit 1
fi
rm "$TMPFILE"

node <<_EOF_ >"$TMPFILE" &
    const onDeath = require('../ondeath');
    onDeath(() => false, { uncaughtException: true });
    setTimeout(() => {}, 10000);
    JSON.parse('F A I L')
_EOF_
PID="$!"
sleep 3
if ps -p $PID > /dev/null; then
    kill -KILL $PID
else
    echo "Process died when not supposed to, on uncaught exception"
    exit 1
fi
rm "$TMPFILE"

popd >/dev/null

echo "OK! :)"
exit 0