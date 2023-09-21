'use strict';

function urlPathIsHtml(urlPath) {
    var basename = urlPath.split("/").pop().replace(/\?.*/, ""); // remove query params

    return basenameIsHtml(basename);
}

function basenameIsHtml(basename) {
    if (basename === "") return true;

    // doesn't detect index.whatever.html (multiple dots)
    var hasHtmlOrNoExtension = !!basename.match(/^(([^.]|\.html?)+)$/);

    if (hasHtmlOrNoExtension) return true;

    // hack to handle basenames with multiple dots: index.whatever.html
    var endsInHtml = !!basename.match(/.html?$/);

    if (endsInHtml) return true;

    // hack to detect extensions that are not HTML so we can handle
    // paths with dots in them
    var endsInOtherExtension = basename.match(/\.[a-zA-Z0-9]{1,5}$/);
    if (!endsInOtherExtension) return true;

    return false;
}

export const handler = (event, context, callback) => {
    const name = 'cloudfront-is-mobile-viewer';
    const xprerenderhost = 'x-prerender-host'
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    console.log('request',request.headers[name][0]);

    if (headers[name] && headers[name][0].value == "true") {
        console.log('in if condition')
        callback(null, {
            status: '302',
            statusDescription: 'Found',
            headers: {
                location: [{
                    key: 'Location',
                    value: `https://m.dev.eventreply.com${request.uri}`,
                }]
            }
        })
    }
    
    else if(headers[xprerenderhost]){
        console.log('in prerender condition')
        callback(null, {
            status: '302',
            statusDescription: 'Found',
            headers: {
                location: [{
                    key: 'Location',
                    value: `https://prerender.dev.eventreply.com${request.uri}`
                }]
            }
        })
    }


      var olduri=request.uri;
      if(urlPathIsHtml(olduri)){
// var newuri = olduri.replace(/\/$/, '\/index.html');
            var newuri='/index.html';
            console.log('new uri');
            console.log(newuri);
            request.uri = newuri;
        }

    callback(null, request);

}
