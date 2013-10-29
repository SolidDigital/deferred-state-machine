# deferred state machine
#### (a finite state machine)
=================================================

## Installation

Use bower to install as part of a project:
```
bower install --save deferred-state-machine
```

The state machine depends on jQuery.

To run the tests:
```
npm install && bower install && grunt testServer
```

Tests can be viewed [here](http://solid-interactive.github.io/deferred-state-machine/tests).

## Description

`deferredStateMachineFatory.js` is an amd compatible Finite State Machine Factory that takes an object and a finite state machine
configuration. Only the methods referenced in the configuration are affected, and those methods
will resolve and call the original method if in the correct state. They fail and the original method is not fired
if in the incorrect state. The methods are resolved with the return value of the original method, and they are called
with the arguments supplied.

This project uses AMD and depends on jQuery.

The state machines can work with any types of objects including View instances.

For example:

```javascript
obj = {
        walkThrough: function() { ... },
    },
    states = {
        open: {
                allowedMethods: [
                   'walkThrough'
                ],
                allowedTransitions: [
                    'shut'
                ]
            },
        shut: {
                allowedMethods: [
                ],
                allowedTransitions: [
                    'open', 'destroyed'
                ]
            }
    };

stateMachine = DeferredStateMachineFactory(obj, states);

stateMachine.getStates(); // output: ['open', 'shut']

stateMachine
    .transition('open')
    .done(function() {
        stateMachine
            .walkThrough()
            .done(function() {
                transition('shut');
            });
    });
```

States are defined as objects. Each object has an `allowedMethods` and an `allowedTransitions` array. These are enforced
by the state machine.

To start the machine, transition to a state using `.transition()`. `.transition()` returns a promise that is resolved or
rejected on transition. To call methods on the state machine, simply call them directly. They will each return a promise.
The promise is resolved with the return value if it was allowed to run; otherwise it is rejected.

The Deferred State Machine Factory is tested in `deferredStateMachineFactoryTests.js`.

Release Notes:

* 0.0.4 - 2013 10 29 - removing checked in dependencies
* 0.0.3 - 2013 10 24 - URL typo fix
* 0.0.2 - 2013 10 24 - Remove _ as dependency
* 0.0.1 - 2013 10 23 - Initial Release
