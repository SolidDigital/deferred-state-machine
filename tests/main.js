/*global require*/
// Require.js allows us to configure shortcut alias
require.config({
    shim : {
        mocha : {
            exports : 'mocha'
        },
        sinon : {
            exports : 'sinon'
        }
    },
    paths : {
        jquery : '../app/vendor/jquery/jquery',
        mocha : '../app/vendor/mocha/mocha',
        chai : '../app/vendor/chai/chai',
        squire : '../app/vendor/squire/src/Squire',
        sinon : '../app/vendor/sinon/lib/sinon',
        sinonSpy : '../app/vendor/sinon/lib/sinon/spy',
        sinonChai  : '../app/vendor/sinon-chai/lib/sinon-chai',
        sinonCall : '../app/vendor/sinon/lib/sinon/call',

        deferredStateMachineFactory : '../app/deferredStateMachineFactory'
    }
});

require([
    'mocha',
    './deferredStateMachineFactoryTests',
], function (mocha) {
    mocha.run();
});
