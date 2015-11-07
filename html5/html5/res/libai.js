var manSprite = cc.Sprite.extend({

    spriteSheet : null,
    runningAction : null,
    sprite : null,
    size : null,
    action : null,
    box : null,
    position : null,
    ctor : function () {

        this._super();
        this.size = cc.winSize;

        this.init();
        this._getEvent();
        this.schedule(this.run,0.01,cc.REPEAT_FOREVER,0);
    },

    init : function () {
        this._super();

        cc.spriteFrameCache.addSpriteFrames(res.man_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.man_png);
        this.addChild(this.spriteSheet);


        var animFrames = [];
        for (var i = 1; i <= 6; i++) {
            var str = i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        var animation = new cc.Animation(animFrames, 0.04);
        this.runningAction = new cc.RepeatForever(new cc.Animate(animation));
        this.sprite = new cc.Sprite("#1.png");
        this.sprite.attr({x:this.size.width-200, y:this.size.height/2});
        this.sprite.runAction(this.runningAction);
        //this.sprite.runAction(cc.jumpTo(4, cc.p(300, 48), 100, 4));
        this.spriteSheet.addChild(this.sprite);



        //var actionRotateTo = cc.rotateBy(1, 360);
        //this.sprite.runAction(actionRotateTo.repeatForever());
    },

    _getEvent : function(){

        if("touches" in cc.sys.capabilities){

            cc.eventManager.addListener({

                event : cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesEnded : this._onTouchBegan.bind(this)
            },this);

        }else{

            cc.eventManager.addListener({

                event : cc.EventListener.MOUSE,
                onMouseUp : this._onMouseUp.bind(this)
            },this);

        }
    },

    _onTouchBegan : function(touches,event){

        if (touches.length <= 0)
            return;
        event.getCurrentTarget().moveSprite(touches[0].getLocation());
    },

    _onMouseUp : function(event){

        event.getCurrentTarget().moveSprite(event.getLocation());

    },

    moveSprite:function(position) {
        var self = this;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.runningAction);
        var o = position.x - this.sprite.x;
        var a = position.y - this.sprite.y;
        var at = Math.atan(o / a) * 60;

        if (a < 0) {
            if (o < 0)
                at = 180 + Math.abs(at);
            else
                at = 180 - Math.abs(at);
        }
        var o1 = position.x + this.sprite.x;
        var a1 = position.y + this.sprite.y;
        var controlPoints = [ cc.p(this.sprite.x, this.sprite.y), cc.p(o1/2, a1/2), position];
        this.action = cc.spawn(cc.rotateTo(Math.sqrt(o*o+a*a)/900, at),cc.moveTo(Math.sqrt(o*o+a*a)/600, position).easing(cc.easeSineInOut()));
        this.sprite.runAction(this.action);

    },

    run : function(){

        this.box = this.sprite.getBoundingBox();
        this.position = this.sprite.getPosition();

        if(this.sprite.x<=32)
            this.sprite.x = 32
        if(this.sprite.x>=628)
            this.sprite.x = 628
        if(this.sprite.y<=48)
            this.sprite.y = 48
        if(this.sprite.y>=1088)
            this.sprite.y = 1088
    }

});

var manScene = cc.Scene.extend({

    onEnter : function(){

        this._super();
        var layer = new manLayer();
        this.addChild(layer);
    }
});