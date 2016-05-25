'use strict';

/**
 * @constructor
 */
var ListElement = function(value)
{
    /**
     * @type {null|ListElement}
     */
    this.prev  = null;

    /**
     * @type {null|ListElement}
     */
    this.next  = null;

    /**
     * @type {mixed}
     */
    this.value = value;
};

/**
 * @constructor
 */
var List = function()
{
    /**
     * @type {List}
     */
    var me = this;

    /**
     * @type {ListElement}
     */
    var first = null;

    /**
     * @type {ListElement}
     */
    var last  = null;

    /**
     * @type {number}
     */
    var count = 0;

    /**
     * @returns {null|ListElement}
     */
    this.first = function()
    {
        return first;
    }

    /**
     * @returns {null|ListElement}
     */
    this.last = function()
    {
        return last;
    }

    /**
     * @return {number}
     */
    this.count = this.lentgh = function()
    {
        return count;
    }

    /**
     * @param {ListElement|mixed} voe
     * @returns {ListElement}
     */
    this.createElement = function(voe)
    {
        if (!(voe instanceof ListElement)) {
            voe = new ListElement(voe);
        }

        return voe;
    };

    /**
     * @param {ListElement|mixed} voe
     * @returns {ListElement}
     */
    this.add = this.append = function(voe)
    {
        var e = me.createElement(voe);

        if (!first) {
            first = last = e;
        } else {
            e.prev    = last;
            last.next = e;
            last      = e;
        }

        count++;

        return e;
    };

    /**
     * @param {[]} arrayData
     * @returns {List}
     */
    this.addMulti = this.appendMulti = function(arrayData)
    {
        for (var key in arrayData) {
            this.append(arrayData[key]);
        }

        return me;
    };

    /**
     * @param {ListElement|mixed} voe
     * @returns {ListElement}
     */
    this.prepend = function(voe)
    {
        var e = me.createElement(voe);

        if (!first) {
            first = last = e;
        } else {
            e.next     = first;
            first.prev = e;
            first      = e;
        }

        count++;

        return e;
    };

    /**
     * @param {[]} arrayData
     * @param {bool} iterate if iterate true, the last elemnt in the array will be the first in the list! (reversed)
     * @returns {List}
     */
    this.prependMulti = function(arrayData, iterate) {
        var keys = [];

        if (!iterate) {
            arrayData.reverse();
        }

        for (var key in arrayData) {
            this.prepend(arrayData[key]);
        }

        return me;
    };

    /**
     * @param {ListElement|mixed} ele
     * @param {bool} extact only needed if remove by value will be called (use === instead of ==)
     */
    this.remove = function(ele, exact)
    {
        if (ele instanceof ListElement) {
            if (ele.next && ele.prev) {
                ele.prev.next = ele.next;
                ele.next.prev = ele.prev;
            } else if (ele.next && !ele.prev) {
                first      = ele.next;
                first.prev = null;
            } else if (!ele.next && ele.prev) {
                last      = ele.prev;
                last.next = null;
            } else {
                last  = null;
                first = null;
            }

            count--;
        } else { //remove by value (0-n)
            exact = typeof exact == 'undefined' ? true : exact

            me.foreach(function(val) {
                if (exact && ele === val)
                    me.remove(this);
                else if (ele == val)
                    me.remove(this);
            });
        }
    };

    /**
     * @param {Function} callback
     * @return {List}
     */
    this.foreach = function(callback)
    {
        var current = first;

        while (current) {
            var cbd = current; //removeable elemens in foreach
            current = current.next;

            callback.call(cbd, cbd.value);
        }

        return me;
    };

    /**
     * @param {null|Function} callback
     * @returns {List}
     */
    this.sort = function(callback)
    {
        if (me.lentgh() > 1) {
            var sortArray = [];

            me.foreach(function(val) {
                sortArray.push([val, this]);
            })

            if (callback) {
                sortArray.sort(function(a, b) {
                    callback(a[0], b[0]);
                });
            } else {
                sortArray.sort();
            }

            first = sortArray[0][1];
            last  = sortArray[sortArray.length - 1][1];

            first.prev = null;
            last.next  = null;

            for (var i = 1; i < sortArray.length; i++) {
                sortArray[i][1].prev     = sortArray[i - 1][1];
                sortArray[i - 1][1].next = sortArray[i][1];
            }
        }

        return me;
    }
};
