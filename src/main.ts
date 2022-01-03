import esSupport from 'es-support';

const features = ['ES2020', 'ES2019', 'ES2018', 'ES2017', 'ES2016', 'ES2015'];
if (esSupport(features)) {
    import(/* webpackChunkName: "mainApp" */ './mainApp');
} else {
    const errorFeatures= esSupport(features, 'details');
    const mainEl = document.createElement('div');
    mainEl.appendChild(document.createTextNode('Your browser does not support ' +
        'some important feature which are needed by this application.'));
    mainEl.appendChild(document.createElement('br'));
    mainEl.appendChild(document.createElement('br'));
    mainEl.appendChild(document.createTextNode('Features your browser does not ' +
        'support are: ' + errorFeatures.join(', ')));
    mainEl.style.position = 'fixed';
    mainEl.style.top = '50%';
    mainEl.style.left = '50%';
    mainEl.style.transform = 'translate(-50%, -50%)';
    mainEl.style.backgroundColor = 'rgb(255, 100, 100)';
    mainEl.style.padding = '15px';
    mainEl.style.margin = '15px';
    document.body.appendChild(mainEl);
}
