"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var utils_1 = require("@ngui/utils");
var NguiScrollableDirective = (function () {
    function NguiScrollableDirective(el) {
        this.elementVisible = new core_1.EventEmitter();
        this.sections = [];
        this.visible = utils_1.elementVisible;
        this.el = el.nativeElement;
        this.el.style.position = 'relative';
    }
    // setup list of sections
    NguiScrollableDirective.prototype.ngOnInit = function () {
        for (var i = 0; i < this.el.children.length; i++) {
            var childEl = this.el.children[i];
            childEl.id && this.sections.push(childEl);
        }
        var thisElStyle = window.getComputedStyle(this.el);
        var elToListenScroll = thisElStyle.overflow === 'auto' ? this.el : window;
        this.listenScrollOn(elToListenScroll);
    };
    NguiScrollableDirective.prototype.listenScrollOn = function (el) {
        var _this = this;
        el.addEventListener('scroll', function () {
            var elScrolledToVisible = null;
            for (var i = 0; i < _this.sections.length; i++) {
                var section = _this.sections[i];
                var visible = _this.visible(section, el);
                if (_this.horizontal && (visible.left || visible.right)) {
                    elScrolledToVisible = section;
                    break;
                }
                else if (!_this.horizontal && (visible.top || visible.bottom)) {
                    elScrolledToVisible = section;
                    break;
                }
            }
            elScrolledToVisible && _this.elementVisible.emit(elScrolledToVisible);
        });
    };
    NguiScrollableDirective.scrollTo = function (selector, parentSelector, horizontal, distance) {
        // argument validation
        var parentEl, targetEl;
        parentSelector = parentSelector || 'body';
        targetEl = document.querySelector(selector);
        if (!targetEl) {
            throw "Invalid selector " + selector;
        }
        parentEl = document.querySelector(parentSelector);
        if (!parentEl) {
            throw "Invalid parent selector " + parentSelector;
        }
        // detect the current environment
        var parentElStyle = window.getComputedStyle(parentEl);
        var scrollContainerEl = parentElStyle.overflow === 'auto' ?
            parentEl : document.body;
        var currentScrollTop = scrollContainerEl.scrollTop;
        var currentScrollLeft = scrollContainerEl.scrollLeft;
        // determine targetOffsetTop(or Left);
        var targetOffsetTop;
        var targetOffsetLeft;
        if (scrollContainerEl === document.body) {
            var bodyRect = document.body.getBoundingClientRect();
            var targetRect = targetEl.getBoundingClientRect();
            targetOffsetTop = targetRect.top - bodyRect.top;
            targetOffsetLeft = targetRect.left - bodyRect.left;
        }
        else {
            targetOffsetTop = targetEl.offsetTop;
            targetOffsetLeft = targetEl.offsetLeft;
        }
        if (distance) {
            currentScrollTop += distance;
            currentScrollLeft += distance;
        }
        // start scrolling
        var step = horizontal ?
            Math.ceil((targetOffsetLeft - currentScrollLeft) / 10) :
            Math.ceil((targetOffsetTop - currentScrollTop) / 10);
        var scrollProp = horizontal ? 'scrollLeft' : 'scrollTop';
        (function loop(i, prop) {
            setTimeout(function main() {
                scrollContainerEl[prop] += step;
                i > 1 && loop(i - 1, prop);
            }, 50);
        }(10, scrollProp));
    };
    return NguiScrollableDirective;
}());
NguiScrollableDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[ngui-scrollable]'
            },] },
];
/** @nocollapse */
NguiScrollableDirective.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
]; };
NguiScrollableDirective.propDecorators = {
    'horizontal': [{ type: core_1.Input },],
    'elementVisible': [{ type: core_1.Output },],
};
exports.NguiScrollableDirective = NguiScrollableDirective;
//# sourceMappingURL=scrollable.directive.js.map