var expect = require('chai').expect;
var jsdom = require('jsdom').jsdom;
var cookie = require('cookie');
var attrify = require('..');
var encodedReferrer = '';

var cookieData = {};

beforeEach(function () {

  global.document = jsdom('', {
    url: 'http://www.lukebussey.com/',
    referrer: 'https://www.google.com'
  });
  global.window = global.document.defaultView;

  encodedReferrer = encodeURIComponent('https://www.google.com');

});

describe('attrify', function () {
  it('should set a referrer cookie by default', function () {

    attrify();

    cookieData = cookie.parse(document.cookie);

    expect(cookieData).to.have.all.keys('initial_referrer', 'referrer');
    expect(cookieData.initial_referrer).to.equal('https://www.google.com');
    expect(cookieData.referrer).to.equal('https://www.google.com');
  });

  describe('with a query string', function () {

    beforeEach(function () {
      window.location.href = '/path/?foo=bar&utm_campaign=test&utm_medium=test&utm_source=test&utm_term=test&utm_content=test';
    });

    it('should only set the correct cookies', function () {

      attrify();

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.have.all.keys('initial_referrer', 'referrer',
                                          'initial_utm_campaign', 'utm_campaign',
                                          'initial_utm_medium', 'utm_medium',
                                          'initial_utm_source', 'utm_source',
                                          'initial_utm_term', 'utm_term',
                                          'initial_utm_content', 'utm_content');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.initial_referrer).to.equal('https://www.google.com');
      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.initial_utm_campaign).to.equal('test');
      expect(cookieData.utm_campaign).to.equal('test');
      expect(cookieData.initial_utm_medium).to.equal('test');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.initial_utm_source).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
      expect(cookieData.initial_utm_content).to.equal('test');
      expect(cookieData.utm_content).to.equal('test');
      expect(cookieData.initial_utm_term).to.equal('test');
      expect(cookieData.utm_term).to.equal('test');

    });

    it('should only set the specified cookies', function () {

      attrify({
        defaults: false,
        params: ['utm_source', 'utm_medium']
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.have.all.keys('initial_referrer', 'referrer',
                                          'initial_utm_medium', 'utm_medium',
                                          'initial_utm_source', 'utm_source');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.initial_referrer).to.equal('https://www.google.com');
      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.initial_utm_medium).to.equal('test');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.initial_utm_source).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');

    });

    it('should set specified extra cookies', function () {

      attrify({
        params: ['foo']
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.have.all.keys('initial_referrer', 'referrer',
                                          'initial_utm_campaign', 'utm_campaign',
                                          'initial_utm_medium', 'utm_medium',
                                          'initial_utm_source', 'utm_source',
                                          'initial_utm_term', 'utm_term',
                                          'initial_utm_content', 'utm_content',
                                          'initial_foo', 'foo');

      expect(cookieData.initial_referrer).to.equal('https://www.google.com');
      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.initial_utm_campaign).to.equal('test');
      expect(cookieData.utm_campaign).to.equal('test');
      expect(cookieData.initial_utm_medium).to.equal('test');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.initial_utm_source).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
      expect(cookieData.initial_utm_content).to.equal('test');
      expect(cookieData.utm_content).to.equal('test');
      expect(cookieData.initial_utm_term).to.equal('test');
      expect(cookieData.utm_term).to.equal('test');
      expect(cookieData.initial_foo).to.equal('bar');
      expect(cookieData.foo).to.equal('bar');

    });

    it('should only set the specified cookie', function () {

      attrify({
        defaults: false,
        params: ['foo']
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.have.all.keys('initial_referrer', 'referrer',
                                          'initial_foo', 'foo');

      expect(cookieData.initial_referrer).to.equal('https://www.google.com');
      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.initial_foo).to.equal('bar');
      expect(cookieData.foo).to.equal('bar');

    });

    it('should use the specified cookie prefix', function () {

      attrify({
        prefix: '_',
        initialPrefix: 'init_',
        lastPrefix: 'last_'
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.have.all.keys('_init_referrer', '_last_referrer',
                                          '_init_utm_campaign', '_last_utm_campaign',
                                          '_init_utm_medium', '_last_utm_medium',
                                          '_init_utm_source', '_last_utm_source',
                                          '_init_utm_term', '_last_utm_term',
                                          '_init_utm_content', '_last_utm_content');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData._init_referrer).to.equal('https://www.google.com');
      expect(cookieData._last_referrer).to.equal('https://www.google.com');
      expect(cookieData._init_utm_campaign).to.equal('test');
      expect(cookieData._last_utm_campaign).to.equal('test');
      expect(cookieData._init_utm_medium).to.equal('test');
      expect(cookieData._last_utm_medium).to.equal('test');
      expect(cookieData._init_utm_source).to.equal('test');
      expect(cookieData._last_utm_source).to.equal('test');
      expect(cookieData._init_utm_content).to.equal('test');
      expect(cookieData._last_utm_content).to.equal('test');
      expect(cookieData._init_utm_term).to.equal('test');
      expect(cookieData._last_utm_term).to.equal('test');

    });

    it('should set cookies with the correct sub-domain', function () {

      attrify({
        domain: '.lukebussey.com'
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.have.all.keys('initial_referrer', 'referrer',
                                          'initial_utm_campaign', 'utm_campaign',
                                          'initial_utm_medium', 'utm_medium',
                                          'initial_utm_source', 'utm_source',
                                          'initial_utm_term', 'utm_term',
                                          'initial_utm_content', 'utm_content');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.initial_referrer).to.equal('https://www.google.com');
      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.initial_utm_campaign).to.equal('test');
      expect(cookieData.utm_campaign).to.equal('test');
      expect(cookieData.initial_utm_medium).to.equal('test');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.initial_utm_source).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
      expect(cookieData.initial_utm_content).to.equal('test');
      expect(cookieData.utm_content).to.equal('test');
      expect(cookieData.initial_utm_term).to.equal('test');
      expect(cookieData.utm_term).to.equal('test');

    });

    it('should set cookies with the correct sub-domain', function () {

      attrify({
        domain: '.notlukebussey.com'
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer', 'referrer',
                                          'initial_utm_campaign', 'utm_campaign',
                                          'initial_utm_medium', 'utm_medium',
                                          'initial_utm_source', 'utm_source',
                                          'initial_utm_term', 'utm_term',
                                          'initial_utm_content', 'utm_content');

      expect(cookieData).to.not.have.any.keys('foo');

    });

    it('should set cookies with the correct path', function () {

      attrify({
        path: '/path/'
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.have.all.keys('initial_referrer', 'referrer',
                                          'initial_utm_campaign', 'utm_campaign',
                                          'initial_utm_medium', 'utm_medium',
                                          'initial_utm_source', 'utm_source',
                                          'initial_utm_term', 'utm_term',
                                          'initial_utm_content', 'utm_content');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.initial_referrer).to.equal('https://www.google.com');
      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.initial_utm_campaign).to.equal('test');
      expect(cookieData.utm_campaign).to.equal('test');
      expect(cookieData.initial_utm_medium).to.equal('test');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.initial_utm_source).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
      expect(cookieData.initial_utm_content).to.equal('test');
      expect(cookieData.utm_content).to.equal('test');
      expect(cookieData.initial_utm_term).to.equal('test');
      expect(cookieData.utm_term).to.equal('test');

    });

    it('should set cookies with the correct path', function () {

      attrify({
        path: '/different-path/'
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer', 'referrer',
                                              'initial_utm_campaign', 'utm_campaign',
                                              'initial_utm_medium', 'utm_medium',
                                              'initial_utm_source', 'utm_source',
                                              'initial_utm_term', 'utm_term',
                                              'initial_utm_content', 'utm_content');

      expect(cookieData).to.not.have.any.keys('foo');

    });

    it('should remove any previously set cookies', function () {

      attrify();

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.have.all.keys('initial_referrer', 'referrer',
                                          'initial_utm_campaign', 'utm_campaign',
                                          'initial_utm_medium', 'utm_medium',
                                          'initial_utm_source', 'utm_source',
                                          'initial_utm_term', 'utm_term',
                                          'initial_utm_content', 'utm_content');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.initial_referrer).to.equal('https://www.google.com');
      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.initial_utm_campaign).to.equal('test');
      expect(cookieData.utm_campaign).to.equal('test');
      expect(cookieData.initial_utm_medium).to.equal('test');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.initial_utm_source).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
      expect(cookieData.initial_utm_content).to.equal('test');
      expect(cookieData.utm_content).to.equal('test');
      expect(cookieData.initial_utm_term).to.equal('test');
      expect(cookieData.utm_term).to.equal('test');

      window.location.href = '/path/?foo=bar&utm_campaign=test';

      attrify();

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.have.all.keys('initial_referrer', 'referrer',
                                          'initial_utm_campaign', 'utm_campaign',
                                          'initial_utm_medium',
                                          'initial_utm_source',
                                          'initial_utm_term',
                                          'initial_utm_content');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.initial_referrer).to.equal('https://www.google.com');
      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.initial_utm_campaign).to.equal('test');
      expect(cookieData.utm_campaign).to.equal('test');
      expect(cookieData.initial_utm_medium).to.equal('test');
      expect(cookieData.initial_utm_source).to.equal('test');
      expect(cookieData.initial_utm_content).to.equal('test');
      expect(cookieData.initial_utm_term).to.equal('test');

    });

  });

  describe('with additional data', function () {

    beforeEach(function () {
      window.location.href = '/path/?foo=bar&utm_campaign=test&utm_medium=test&utm_source=test&utm_term=test&utm_content=test';
    });

    it('should only set the correct cookies', function () {

      attrify({
        data: {
          baz: 'qux'
        }
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.have.all.keys('initial_referrer', 'referrer',
                                          'initial_utm_campaign', 'utm_campaign',
                                          'initial_utm_medium', 'utm_medium',
                                          'initial_utm_source', 'utm_source',
                                          'initial_utm_term', 'utm_term',
                                          'initial_utm_content', 'utm_content',
                                          'initial_baz', 'baz');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.initial_referrer).to.equal('https://www.google.com');
      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.initial_utm_campaign).to.equal('test');
      expect(cookieData.utm_campaign).to.equal('test');
      expect(cookieData.initial_utm_medium).to.equal('test');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.initial_utm_source).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
      expect(cookieData.initial_utm_content).to.equal('test');
      expect(cookieData.utm_content).to.equal('test');
      expect(cookieData.initial_utm_term).to.equal('test');
      expect(cookieData.utm_term).to.equal('test');
      expect(cookieData.initial_baz).to.equal('qux');
      expect(cookieData.baz).to.equal('qux');

    });

    it('should only set the specified cookies', function () {

      attrify({
        defaults: false,
        params: ['utm_source', 'utm_medium'],
        data: {
          baz: 'qux'
        }
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.have.all.keys('initial_referrer', 'referrer',
                                          'initial_utm_medium', 'utm_medium',
                                          'initial_utm_source', 'utm_source',
                                          'initial_baz', 'baz');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.initial_referrer).to.equal('https://www.google.com');
      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.initial_utm_medium).to.equal('test');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.initial_utm_source).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
      expect(cookieData.initial_baz).to.equal('qux');
      expect(cookieData.baz).to.equal('qux');

    });

    it('should only set the specified cookie', function () {

      attrify({
        defaults: false,
        data: {
          baz: 'qux'
        }
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.have.all.keys('initial_referrer', 'referrer',
                                          'initial_baz', 'baz');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.initial_referrer).to.equal('https://www.google.com');
      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.initial_baz).to.equal('qux');
      expect(cookieData.baz).to.equal('qux');

    });

    it('should not set null, undefined or empty cookies', function () {

      var qux;

      attrify({
        defaults: false,
        data: {
          baz: qux,
          wibble: null,
          wobble: '',
          wubble: 0,
          fibble: true,
          fubble: false
        }
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.have.all.keys('initial_referrer', 'referrer',
                                          'initial_wubble', 'wubble',
                                          'initial_fibble', 'fibble',
                                          'initial_fubble', 'fubble');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.initial_referrer).to.equal('https://www.google.com');
      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.initial_wubble).to.equal('0');
      expect(cookieData.wubble).to.equal('0');
      expect(cookieData.initial_fibble).to.equal('true');
      expect(cookieData.fibble).to.equal('true');
      expect(cookieData.initial_fubble).to.equal('false');
      expect(cookieData.fubble).to.equal('false');

    });

  });

});
