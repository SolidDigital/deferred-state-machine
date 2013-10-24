# deferred state machine (a finite state machine)
=================================================

## Description

`deferredStateMachineFatory.js` is a Finite State Machine Factory that takes an object and a finite state machine
configuration. Only the methods reference in the configuration are affected, and those methods are turned into resolved
that only resolve and call the original method if in the correct state. They fail and the original method is not fired
if in the incorrect state.

The state machines can work with any types of objects including View instances.

For example:

```javascript
obj = {
    walkThrough: function() { ... },
    lock: function() { ... },
    unlock: function() { ... },
    openDoor: function() { ... },
    closeDoor: function() { ... },
    kickDown: function() { ... }
},
states = {
    open: {
            allowedMethods: [
               'walkThrough', 'closeDoor'
            ],
            allowedTransitions: [
                'shut'
            ]
        },
    shut: {
            allowedMethods: [
                'lock', 'openDoor'
            ],
            allowedTransitions: [
                'open', 'destroyed'
            ]
        },
    locked: {
            allowedMethods: [
                'unlock', 'kickDown'
            ],
            allowedTransitions: [
                'shut', 'destroyed'
            ]
        },
    destroyed: {
            // End state
        }
};

stateMachine = DeferredStateMachineFactory(obj, states);

stateMachine.getStates(); // output: ['open', 'shut', 'locked', 'destroyed']

stateMachine.transition.open().done(function() {
    stateMachine.walkThrough();
});
```

States are defined as objects. Each object has an `allowedMethods` and an `allowedTransitions` array. These are enforced
by the state machine.

To start the machine, transition to a state using `.transition()`. `.transition()` returns a promise that is resolved or
rejected on transition. To call methods on the state machine, simply call them directly. They will each return a promise.
The promise is resolved with the return value if it was allowed to run; otherwise it is rejected.

The Deferred State Machine Factory is tested in `deferredStateMachineFactoryTests.js`.
