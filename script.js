const open = XMLHttpRequest.prototype.open;

window.XMLHttpRequest.prototype.open = function(_, url) {
    const thisProxy = this;
    let onreadystatechange = this.onreadystatechange;

    thisProxy.onreadystatechange = () => {
        if (
            url.includes('/twitter.com/i/api/')
            && thisProxy.readyState === 4
            && thisProxy.status > 199 && thisProxy.status < 300
            && (thisProxy.responseType === '' || thisProxy.responseType === 'text')
            && thisProxy.responseText
        ) {
            const modifiedResponseText = thisProxy.responseText.replace(
                /is_blue_verified\":true/gm,
                'is_blue_verified\":false'
            );
            Object.defineProperty(thisProxy, 'responseText', {
                value: modifiedResponseText
            });
        }

        if (onreadystatechange) {
            onreadystatechange.apply(thisProxy, arguments);
        };
    };

    Object.defineProperty(this, 'onreadystatechange', {
        get: () => onreadystatechange,
        set: (value) => {
            onreadystatechange = value;
        },
    });

    return open.apply(thisProxy, arguments);
};