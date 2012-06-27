var Eventable =
{
    addEventListener: function(type, listener)
    {
        if (this.eventMap == null)
            this.eventMap = {};
        var list = this.eventMap[type];
        if (list == null)
        {
            list = [];
            this.eventMap[type] = list;
        }
        list.push(listener);
    },

    dispatchEvent: function(event, options)
    {
        if (this.eventMap == null)
            return false;
        if (event.target == null)
            event.target = this;

        var list = this.eventMap[event];
        if (list != null)
        {
            var length = list.length;
            for (var i=0; i<length; i++)
            {
                var listener = list[i];
                if (listener != null)
                {
                    var res = listener(options);
                    if (res === false) return;
                }
            }
            return true;
        }
        return false;
    },

    hasEventListener: function(type)
    {
        if (this.eventMap == null)
            return false;
        var h = this.eventMap[type];
        return (h == null) ? false : (h.length > 0);
    },

    removeEventListener: function(type, listener)
    {
        if (this.eventMap == null)
            return;

        var list = this.eventMap[type];
        if (isNullOrEmpty(list)) return;
        var length = list.length;
        for (var i=0; i<length; i++)
        {
            if (list[i] === listener)
            {
                list.splice(i, 1);
                return;
            }
        }
    },

    removeAllListeners: function()
    {
        this.eventMap = null;
    },

    willTrigger: function(type)
    {
        if (this.eventMap == null)
            return false;
        return this.eventMap[type] != null;
    }
};