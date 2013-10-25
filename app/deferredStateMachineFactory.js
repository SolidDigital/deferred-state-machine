define(['jquery'], function($) {

    /**
     * A finite state machine that works with deferreds.
     * FSMs are created using the factory method that this module returns.
     *
     * Since the state machine factory creates a finite state machine from a passed in
     * object, any object can be used. This includes things like Backbone Views.
     *

     */
    return function(obj, states) {
        var _ = internalCustomLodash(),
            Factory = this,
            methods = {
                getState: getState,
                getStates: getStates,
                transition: deferIt(transition),
                transitionAllowed: transitionAllowed
            },

            // Private variables
            _currentState,
            _stateNames = _.keys(states),
            _allMethodNames = _.keys(obj);

        // Constants
        Factory.TRANSITION_NOT_ALLOWED = 'transition not allowed';
        Factory.METHOD_NOT_ALLOWED = 'method not allowed';


        _.forEach(_allMethodNames, function(methodName) {
            var method = obj[methodName];
            if (Function !== method.constructor) {
                return;
            }

            obj[methodName] = deferIt(function(deferred) {
                var allowedMethods,
                    args = Array.prototype.slice.call(arguments);

                if (!_currentState) {
                    deferred.reject(Factory.METHOD_NOT_ALLOWED);
                    return;
                }

                args.shift();

                allowedMethods = states[_currentState].allowedMethods;

                if (allowedMethods && _.contains(allowedMethods, methodName)) {
                    deferred.resolve(method.apply(obj, args));
                } else {
                    deferred.reject(Factory.METHOD_NOT_ALLOWED);
                }
            }.bind(obj));
        });
        $.extend(obj, methods);
        return obj;

        function getState() {
            return _currentState;
        }

        function getStates() {
            return _stateNames;
        }

        function transition(deferred, newState) {
            var oldState;

            if (transitionAllowed(newState)) {
                oldState = _currentState;
                _currentState = newState;
                deferred.resolve({
                    oldState: oldState,
                    newState: newState
                });
            } else {
                deferred.reject(Factory.TRANSITION_NOT_ALLOWED);
            }
        }

        function transitionAllowed(newState) {
            var allowed = true,
                allowedTransitions;

            if (!_currentState) {
                allowed = _.contains(_stateNames, newState);
            } else {
                allowedTransitions = states[_currentState].allowedTransitions;
                allowed = allowedTransitions && _.contains(allowedTransitions, newState);
            }
            return allowed;
        }

        // A helper method that creates a new deferred, returns its promise and calls the method with the deferred
        function deferIt(method) {
            return function() {
                var args = Array.prototype.slice.call(arguments),
                    $deferred = $.Deferred();

                args.unshift($deferred);
                method.apply(this,args);
                return $deferred.promise();
            };
        }

        function internalCustomLodash() {
            var lodash;
            /**
             * @license
             * Lo-Dash 2.2.1 (Custom Build) lodash.com/license | Underscore.js 1.5.2 underscorejs.org/LICENSE
             * Build: `lodash include="forEach,contains,keys" exports="none" -m`
             */
            ;(function(){function n(n,t,e){e=(e||0)-1;for(var r=n?n.length:0;++e<r;)if(n[e]===t)return e;return-1}function t(){}function e(n){n.length=0,j.length<_&&j.push(n)}function r(){}function u(n,t,e){if(typeof n!="function")return d;if(typeof t=="undefined")return n;var r=n.__bindData__||at.funcNames&&!n.name;if(typeof r=="undefined"){var u=w&&M.call(n);at.funcNames||!u||E.test(u)||(r=!0),(at.funcNames||!r)&&(r=!at.funcDecomp||w.test(u),ct(n,r))}if(true!==r&&r&&1&r[1])return n;switch(e){case 1:return function(e){return n.call(t,e)
            };case 2:return function(e,r){return n.call(t,e,r)};case 3:return function(e,r,u){return n.call(t,e,r,u)};case 4:return function(e,r,u,o){return n.call(t,e,r,u,o)}}return m(n,t)}function o(n,t,r,u,i,a){if(r){var c=r(n,t);if(typeof c!="undefined")return!!c}if(n===t)return 0!==n||1/n==1/t;if(n===n&&!(n&&K[typeof n]||t&&K[typeof t]))return!1;if(null==n||null==t)return n===t;var f=Q.call(n),p=Q.call(t);if(f==A&&(f=B),p==A&&(p=B),f!=p)return!1;switch(f){case P:case D:return+n==+t;case F:return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;
            case I:case N:return n==t+""}if(p=f==S,!p){if(V.call(n,"__wrapped__")||V.call(t,"__wrapped__"))return o(n.__wrapped__||n,t.__wrapped__||t,r,u,i,a);if(f!=B)return!1;var f=!at.argsObject&&l(n)?Object:n.constructor,g=!at.argsObject&&l(t)?Object:t.constructor;if(f!=g&&!(s(f)&&f instanceof f&&s(g)&&g instanceof g))return!1}for(g=!i,i||(i=j.pop()||[]),a||(a=j.pop()||[]),f=i.length;f--;)if(i[f]==n)return a[f]==t;var y=0,c=!0;if(i.push(n),a.push(t),p){if(f=n.length,y=t.length,c=y==n.length,!c&&!u)return c;
                for(;y--;)if(p=f,g=t[y],u)for(;p--&&!(c=o(n[p],g,r,u,i,a)););else if(!(c=o(n[y],g,r,u,i,a)))break;return c}return gt(t,function(t,e,f){return V.call(f,e)?(y++,c=V.call(n,e)&&o(n[e],t,r,u,i,a)):void 0}),c&&!u&&gt(n,function(n,t,e){return V.call(e,t)?c=-1<--y:void 0}),g&&(e(i),e(a)),c}function i(n,t,e,r,u,o){var a=1&t,f=2&t,l=4&t,g=8&t,y=16&t,h=32&t,v=n;if(!f&&!s(n))throw new TypeError;y&&!e.length&&(t&=-17,y=e=!1),h&&!r.length&&(t&=-33,h=r=!1);var b=n&&n.__bindData__;if(b)return!a||1&b[1]||(b[4]=u),!a&&1&b[1]&&(t|=8),!l||4&b[1]||(b[5]=o),y&&W.apply(b[2]||(b[2]=[]),e),h&&W.apply(b[3]||(b[3]=[]),r),b[1]|=t,i.apply(null,b);
                if(!a||f||l||h||!(at.fastBind||Y&&y))d=function(){var s=arguments,b=a?u:this;return(l||y||h)&&(s=rt.call(s),y&&U.apply(s,e),h&&W.apply(s,r),l&&s.length<o)?(t|=16,i(n,g?t:-4&t,s,null,u,o)):(f&&(n=b[v]),this instanceof d?(b=c(n.prototype),s=n.apply(b,s),p(s)?s:b):n.apply(b,s))};else{if(y){var m=[u];W.apply(m,e)}var d=y?Y.apply(n,m):Y.call(n,u)}return ct(d,rt.call(arguments)),d}function a(){R.h=x,R.b=R.c=R.g=R.i="",R.e="t",R.j=!0;for(var n,t=0;n=arguments[t];t++)for(var e in n)R[e]=n[e];t=R.a,R.d=/^[^,]+/.exec(t)[0],n=Function,t="return function("+t+"){",e=R;
                var r="var n,t="+e.d+",E="+e.e+";if(!t)return E;"+e.i+";";e.b?(r+="var u=t.length;n=-1;if("+e.b+"){",at.unindexedChars&&(r+="if(s(t)){t=t.split('')}"),r+="while(++n<u){"+e.g+";}}else{"):at.nonEnumArgs&&(r+="var u=t.length;n=-1;if(u&&p(t)){while(++n<u){n+='';"+e.g+";}}else{"),at.enumPrototypes&&(r+="var G=typeof t=='function';"),at.enumErrorProps&&(r+="var F=t===k||t instanceof Error;");var o=[];if(at.enumPrototypes&&o.push('!(G&&n=="prototype")'),at.enumErrorProps&&o.push('!(F&&(n=="message"||n=="name"))'),e.j&&e.f)r+="var C=-1,D=B[typeof t]&&v(t),u=D?D.length:0;while(++C<u){n=D[C];",o.length&&(r+="if("+o.join("&&")+"){"),r+=e.g+";",o.length&&(r+="}"),r+="}";
                else if(r+="for(n in t){",e.j&&o.push("m.call(t, n)"),o.length&&(r+="if("+o.join("&&")+"){"),r+=e.g+";",o.length&&(r+="}"),r+="}",at.nonEnumShadows){for(r+="if(t!==A){var i=t.constructor,r=t===(i&&i.prototype),f=t===J?I:t===k?j:L.call(t),x=y[f];",k=0;7>k;k++)r+="n='"+e.h[k]+"';if((!(r&&x[n])&&m.call(t,n))",e.j||(r+="||(!x[n]&&t[n]!==A[n])"),r+="){"+e.g+"}";r+="}"}return(e.b||at.nonEnumArgs)&&(r+="}"),r+=e.c+";return E",n("d,j,k,m,o,p,q,s,v,A,B,y,I,J,L",t+r+"}")(u,C,G,V,O,l,ft,g,R.f,J,K,it,N,T,Q)}function c(n){return p(n)?Z(n):{}
            }function f(){var t=(t=r.indexOf)===v?n:t;return t}function l(n){return n&&typeof n=="object"&&typeof n.length=="number"&&Q.call(n)==A||!1}function s(n){return typeof n=="function"}function p(n){return!(!n||!K[typeof n])}function g(n){return typeof n=="string"||Q.call(n)==N}function y(n,t,e){var r=-1,u=f(),o=n?n.length:0,i=!1;return e=(0>e?et(0,o+e):e)||0,ft(n)?i=-1<u(n,t,e):typeof o=="number"?i=-1<(g(n)?n.indexOf(t,e):u(n,t,e)):pt(n,function(n){return++r<e?void 0:!(i=n===t)}),i}function h(n,t,e){if(t&&typeof e=="undefined"&&ft(n)){e=-1;
                for(var r=n.length;++e<r&&false!==t(n[e],e,n););}else pt(n,t,e);return n}function v(t,e,r){if(typeof r=="number"){var u=t?t.length:0;r=0>r?et(0,u+r):r||0}else if(r)return r=b(t,e),t[r]===e?r:-1;return n(t,e,r)}function b(n,t,e,u){var o=0,i=n?n.length:o;for(e=e?r.createCallback(e,u,1):d,t=e(t);o<i;)u=o+i>>>1,e(n[u])<t?o=u+1:i=u;return o}function m(n,t){return 2<arguments.length?i(n,17,rt.call(arguments,2),null,t):i(n,1,null,null,t)}function d(n){return n}var j=[],O={},_=40,E=/^function[ \n\r\t]+\w/,w=/\bthis\b/,x="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),A="[object Arguments]",S="[object Array]",P="[object Boolean]",D="[object Date]",C="[object Error]",F="[object Number]",B="[object Object]",I="[object RegExp]",N="[object String]",L={configurable:!1,enumerable:!1,value:null,writable:!1},R={a:"",b:null,c:"",d:"",e:"",v:null,g:"",h:null,support:null,i:"",j:!1},K={"boolean":!1,"function":!0,object:!0,number:!1,string:!1,undefined:!1},$=K[typeof window]&&window||this,z=[],G=Error.prototype,J=Object.prototype,T=String.prototype,q=RegExp("^"+(J.valueOf+"").replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/valueOf|for [^\]]+/g,".+?")+"$"),M=Function.prototype.toString,V=J.hasOwnProperty,W=z.push,H=J.propertyIsEnumerable,Q=J.toString,U=z.unshift,X=function(){try{var n={},t=q.test(t=Object.defineProperty)&&t,e=t(n,n,n)&&t
            }catch(r){}return e}(),Y=q.test(Y=Q.bind)&&Y,Z=q.test(Z=Object.create)&&Z,nt=q.test(nt=Array.isArray)&&nt,tt=q.test(tt=Object.keys)&&tt,et=Math.max,rt=z.slice,ut=q.test($.attachEvent),ot=Y&&!/\n|true/.test(Y+ut),it={};it[S]=it[D]=it[F]={constructor:!0,toLocaleString:!0,toString:!0,valueOf:!0},it[P]=it[N]={constructor:!0,toString:!0,valueOf:!0},it[C]=it["[object Function]"]=it[I]={constructor:!0,toString:!0},it[B]={constructor:!0},function(){for(var n=x.length;n--;){var t,e=x[n];for(t in it)V.call(it,t)&&!V.call(it[t],e)&&(it[t][e]=!1)
            }}();var at=r.support={};!function(){function n(){this.x=1}var t={0:1,length:1},e=[];n.prototype={valueOf:1};for(var r in new n)e.push(r);for(r in arguments);at.argsClass=Q.call(arguments)==A,at.argsObject=arguments.constructor==Object&&!(arguments instanceof Array),at.enumErrorProps=H.call(G,"message")||H.call(G,"name"),at.enumPrototypes=H.call(n,"prototype"),at.fastBind=Y&&!ot,at.funcDecomp=!q.test($.k)&&w.test(function(){return this}),at.funcNames=typeof Function.name=="string",at.nonEnumArgs=0!=r,at.nonEnumShadows=!/valueOf/.test(e),at.spliceObjects=(z.splice.call(t,0,1),!t[0]),at.unindexedChars="xx"!="x"[0]+Object("x")[0]
            }(1),Z||(c=function(n){if(p(n)){t.prototype=n;var e=new t;t.prototype=null}return e||{}});var ct=X?function(n,t){L.value=t,X(n,"__bindData__",L)}:t;at.argsClass||(l=function(n){return n&&typeof n=="object"&&typeof n.length=="number"&&V.call(n,"callee")||!1});var ft=nt||function(n){return n&&typeof n=="object"&&typeof n.length=="number"&&Q.call(n)==S||!1},lt=a({a:"z",e:"[]",i:"if(!(B[typeof z]))return E",g:"E.push(n)"}),st=tt?function(n){return p(n)?at.enumPrototypes&&typeof n=="function"||at.nonEnumArgs&&n.length&&l(n)?lt(n):tt(n):[]
            }:lt,nt={a:"g,e,K",i:"e=e&&typeof K=='undefined'?e:d(e,K,3)",b:"typeof u=='number'",v:st,g:"if(e(t[n],n,g)===false)return E"},ut={i:"if(!B[typeof t])return E;"+nt.i,b:!1},pt=a(nt),gt=a(nt,ut,{j:!1});s(/x/)&&(s=function(n){return typeof n=="function"&&"[object Function]"==Q.call(n)}),r.bind=m,r.createCallback=function(n,t,e){var r=typeof n;if(null==n||"function"==r)return u(n,t,e);if("object"!=r)return function(t){return t[n]};var i=st(n),a=i[0],c=n[a];return 1!=i.length||c!==c||p(c)?function(t){for(var e=i.length,r=!1;e--&&(r=o(t[i[e]],n[i[e]],null,!0)););return r
            }:function(n){return n=n[a],c===n&&(0!==c||1/c==1/n)}},r.forEach=h,r.forIn=gt,r.keys=st,r.each=h,r.contains=y,r.identity=d,r.indexOf=v,r.isArguments=l,r.isArray=ft,r.isFunction=s,r.isObject=p,r.isString=g,r.sortedIndex=b,r.include=y,r.VERSION="2.2.1",lodash=r}).call(this);

            return lodash;
        }
    };
});