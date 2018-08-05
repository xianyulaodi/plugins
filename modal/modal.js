;(function (root, factory) {

  if (typeof module === 'object') {
    // webpack
    module.exports = factory();
  } else if (typeof define === 'function') {
    if (define.amd) {
      // AMD
      define(factory);
    } else {
      // CMD
      define(function (require, exports, module) {
        module.exports = factory();
      });
    }
  } else if (typeof exports === 'object') {
    // Node, CommonJS之类的
    module.exports = factory();
  } else {
    // 浏览器全局变量(root 即 window)
    root.Modal = factory();
  }

} (this, function () {

  var doc = document;
  
  function merge(obj1,obj2) {
    var newObj = {};
    for(var k in obj1) {
      if(obj2[k]) {
        newObj[k] = obj2[k];
      } else {
        newObj[k] = obj1[k];
      }
    }
    return newObj;
  }

  function noop() {}

  function Modal(options) {
    var options = merge({
      type: 'modal',   // toast、confirm、alert、modal
      title: '',
      content: '',
      buttons:[/*{text:'取消', callback: noop // }*/]
    }, options);
    this.options = options;
    this.$root = document.querySelector('body');
    this.init();
  }

  Modal.prototype = { 
    
    init: function() {

      this._createMask();
      this._createModal();
    },

    close: function() {
      // this._unBindEvent();
      doc.querySelector('.lc-mask').remove();
      doc.querySelector('.lc-modal').remove();
    },

    _createMask: function() {
      var $mask = this._createElem('lc-mask');
      this.$root.appendChild($mask);
    },

    _createElem: function(className) {
      var $elem = doc.querySelector('.' + className);
      if ($elem) {
        elem.remove();
      }
      $elem = document.createElement('div');
      $elem.className = className;
      return $elem;
    },

    _create_alert: function() {
      var opt = this.options;
      var $modal = this._createElem('lc-modal');
      var template = [
        '<div class="lc-content">', opt.content, '</div>',
        '<ul class="lc-btn-group"><li class="lc-btn lc-alert-btn">确定</li></ul>'
      ];
      $modal.innerHTML = template.join('');
      this.$root.appendChild($modal);
      this._bindEvent();
    },

    _create_modal: function() {
      var opt = this.options;
      var $modal = this._createElem('lc-modal');
      var htmlBtns = [];
      for (var i = 0; i < opt.buttons.length; i++) {
        var button = opt.buttons[i];
        var temp = '<li class="lc-btn lc-btn-' + i + '">' + button.text + '</li>';
        htmlBtns.push(temp);
      }
      var template = [
        opt.title != '' ? '<h2 class="lc-title">' + opt.title + '</h2>' : '',
        '<div class="lc-content">', opt.content, '</div>',
        htmlBtns.length > 0 ? '<ul class="lc-btn-group">' + htmlBtns.join('') + '</ul>' : ''
      ];
      $modal.innerHTML = template.join('');
      this.$root.appendChild($modal);
      this._bindEvent();
    },

    _createModal: function() {
      var type = this.options.type;
      var fn = '_cretae_'+ type;
      if(type == 'alert') {
        this._create_alert();
      } else {
        this._create_modal();
      }
    },

    _bindEvent: function() {
      var btnConf = this.options.buttons;
      var $modal = this.$root.querySelector('.lc-modal');
      var $btns = this.$root.querySelectorAll('.lc-btn');
      var modalW = $modal.clientWidth;
      var modalH = $modal.clientHeight;
      $modal.style.marginLeft = -modalW/2 +'px';
      $modal.style.marginTop = -modalH/2 +'px';
      for (var i = 0; i < $btns.length; i++) {
        var $btn = $btns[i];
        var callback = this.close;
        if (btnConf.length > 0) {
          callback = btnConf[i].callback || noop;
        }
        $btn.addEventListener('click', callback, false);
      }
    }

  };

  return Modal;

})); 