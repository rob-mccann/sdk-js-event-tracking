buster.spec.expose();

var assert = buster.assert;
var refute = buster.refute;

var _opt = {};
_opt.clientId = 'sp-34534';
_opt,clientDomain = 'vg.no'; // FIXME: This needs to go places
_opt.trackingUrl = 'http://127.0.0.1:8002/api/v1/track';
_opt.pageId = 'urn:test.no:pagetest01';
_opt.language = 'no';
_opt.allowAutomaticTracking = false;

var type = 'article';
var title = 'Testtitle';
var content = 'Stoler du på at alle norske medaljevinnere';

buster.testCase('A page load ', {
    'fails if pageId or clientId is missing': function(){
        _opt.clientId = undefined;
        var result = trackPageLoadEvent(undefined, undefined, undefined);
        assert.equals(result, false);

        _opt.cliendId = null;
        var result = trackPageLoadEvent(undefined, undefined, undefined);
        assert.equals(result, false);

        _opt.clientId = '';
        var result = trackPageLoadEvent(undefined, undefined, undefined);
        assert.equals(result, false);

        _opt.clientId = 'sp-34534';

        _opt.pageId = undefined;
        var result = trackPageLoadEvent(undefined, undefined, undefined);
        assert.equals(result, false);

        _opt.pageId = null;
        var result = trackPageLoadEvent(undefined, undefined, undefined);
        assert.equals(result, false);

        _opt.pageId = '';
        var result = trackPageLoadEvent(undefined, undefined, undefined);
        assert.equals(result, false);

        _opt.pageId = 'urn:test.no:pagetest01';

    },
    'server response 200': function(done){

        // trackPageLoadEvent(type, content, title, callback)

        trackPageLoadEvent('article', 'Testtitle', 'Stoler du på at alle norske medaljevinnere', done(function(response){
            assert.equals(response.status, 200);
        }));
    },
    'contains all needed info': function(done){
        trackPageLoadEvent(type, title, content, done(function(response, data){
            assert.equals(response.status, 200);
            for(var i = 0; i < data.length; i++){
                var d = JSON.parse(data[i]);

                // General value checks
                headerAsserts(d);
                providerAsserts(d);
                actorAsserts(d);
                objectAsserts(d);

                // Specific value checks
                // Header asserts
                assert.match(d['@type'], 'Read');

                // Object asserts
                assert.match(d.object['@type'], type);
                assert.match(d.object['@id'], _opt.pageId);
                assert.match(d.object.content, content);
                assert.match(d.object.displayName, title);
            }
        }));
    },
    'has default values': function(done){
        trackPageLoadEvent(undefined, undefined, undefined, done(function(response, data){
            assert.equals(response.status, 200);
            for(var i = 0; i < data.length; i++){
                var d = JSON.parse(data[i]);

                // General value checks
                headerAsserts(d);
                providerAsserts(d);
                actorAsserts(d);
                objectAsserts(d);

                // Specific value checks
                // Header asserts
                assert.match(d['@type'], 'Read');

                // Object asserts
                assert.match(d.object['@type'], 'page');
                assert.match(d.object['@id'], _opt.pageId);
                assert.match(d.object.content, "");
                assert.match(d.object.displayName, document.title);
            }
        }));
    },
});
