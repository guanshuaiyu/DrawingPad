function shape(canvas,canvas1,cobj){
    this.canvas = canvas;
    this.canvas1=canvas1;
    this.cobj = cobj;
    this.bgcolor = "black";
    this.bordercolor = "black";
    this.type="stroke";
    this.shapes="line";
    this.linewidth = 1;
    this.width=canvas1.width;
    this.height=canvas1.height;
    this.history =[];
}
shape.prototype = {
    init:function(){
        this.cobj.fillStyle = this.bgcolor;
        this.cobj.strokeStyle = this.bordercolor;
        this.cobj.lineWidth = this.linewidth;
    },
    line:function(x,y,x1,y1){
        var that=this;
        that.cobj.beginPath();
        that.cobj.moveTo(x,y);
        that.cobj.lineTo(x1,y1);
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    rect:function(x,y,x1,y1){
        var that=this;
        that.cobj.beginPath();
        that.cobj.rect(x,y,x1-x,y1-y);
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    circle:function(x,y,x1,y1){
        var that=this;
        that.cobj.beginPath();
        var r = Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        that.cobj.arc(x,y,r,0,Math.PI*2);
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    pen:function(){
        var that=this;
        that.cobj[that.type]();
    },
    wujiao:function(x,y,x1,y1){
        var that=this;
        var r =Math.sqrt( (x1-x)*(x1-x)+(y1-y)*(y1-y) );
        var r1=r/2;
        that.cobj.beginPath();
        that.cobj.moveTo(x+r,y);
        for( var i=1;i<10;i++){
            if (i%2==0){
                that.cobj.lineTo(Math.cos(i*36*Math.PI/180)*r+x,Math.sin(i*36*Math.PI/180)*r+y);
            }else{
                that.cobj.lineTo(Math.cos(i*36*Math.PI/180)*r1+x,Math.sin(i*36*Math.PI/180)*r1+y);
            }
        }
        that.cobj.closePath();
        that.cobj[this.type]();
    },
    draw:function(){
        var that = this;
        that.canvas.onmousedown = function(e){
            var startx = e.offsetX;
            var starty = e.offsetY;
            if (that.shapes=="pen"){
                that.cobj.beginPath();
                that.cobj.moveTo(startx,starty);
            }
            that.canvas.onmousemove = function(e){
                that.cobj.clearRect(0,0,that.width,that.height);
                if (that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endx = e.offsetX;
                var endy = e.offsetY;
                that.init();
                that[that.shapes](startx,starty,endx,endy);
                if (that.shapes=="pen"){
                    that.cobj.lineTo(endx,endy);
                }
            }
            that.canvas.onmouseup = function(){
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.canvas.onmousemove=null;
                that.canvas.onmouseup=null;
                if(that.shapes=="pen"){
                    that.cobj.closePath();
                }
            }
        }
    },
    xp:function(xpobj,w,h){
        var that=this;
        that.canvas.onmousemove = function (e) {
            var ox = e.offsetX;
            var oy = e.offsetY;
            var lefts = ox - w / 2;
            var tops = oy - h / 2;

            if (lefts < 0) {
                lefts = 0;
            }
            if (lefts > that.width - w) {
                lefts = that.width - w;
            }
            if (tops < 0) {
                tops = 0;
            }
            if (tops > that.height - h) {
                tops = that.height - h;
            }
            xpobj.css({
                display:"block",
                left:lefts,
                width:w,
                height:h,
                top:tops
            })
        }
        that.canvas.onmousedown = function() {
            that.canvas.onmousemove = function (e) {
                var ox = e.offsetX;
                var oy = e.offsetY;
                var lefts = ox - w / 2;
                var tops = oy - h / 2;
                if (lefts < 0) {
                    lefts = 0;
                }
                if (lefts > that.width - w) {
                    lefts = that.width - w;
                }
                if (tops < 0) {
                    tops = 0;
                }
                if (tops > that.height - h) {
                    tops = that.height - h;
                }
                xpobj.css({
                    display:"block",
                    left:lefts,
                    width:w,
                    height:h,
                    top:tops
                })
                that.cobj.clearRect(lefts,tops,w,h);
            }
            that.canvas.onmouseup = function(){
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.canvas.onmousemove=null;
                that.canvas.onmouseup=null;
                xpobj.css({
                    display:"none"
                })
            }
        }
    },
    select:function(selectareaobj){
        var that = this;
        that.init();
        that.canvas.onmousedown = function(e){
            var startx = e.offsetX;
            var starty = e.offsetY;
            var minx,miny,w,h;
            that.canvas.onmousemove  =function(e){
                that.init();
                var endx = e.offsetX;
                var endy = e.offsetY;
                minx=startx>endx?endx:startx;
                miny=starty>endy?endy:starty;
                w=Math.abs(endx-startx);
                h=Math.abs(endy-starty);
                selectareaobj.css({
                    display:"block",
                    left:minx,
                    top:miny,
                    width:w,
                    height:h
                })
            }
            that.canvas.onmouseup = function(){
                that.canvas.onmouseup=null;
                that.canvas.onmousemove=null;
                that.temp=that.cobj.getImageData(minx,miny,w,h);
                that.cobj.clearRect(minx,miny, w,h);
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.cobj.putImageData(that.temp,minx,miny);
                that.drag(minx,miny,w,h,selectareaobj);
            }
        }
    },
    drag:function (x,y,w,h,selectareaobj){
        var that=this;
        that.canvas.onmousemove=function(e){
            var ox= e.offsetX;
            var oy= e.offsetY;
            if(ox>x&&ox<x+w&&oy>y&&oy<y+h){
                that.canvas.style.cursor="move";
            }else{
                that.canvas.style.cursor="default";
            }
        }
        that.canvas.onmousedown = function(e){
            var ox= e.offsetX;
            var oy= e.offsetY;
            var cx = ox-x;
            var cy = oy-y;
            if(ox>x&&ox<x+w&&oy>y&&oy<y+h){
                that.canvas.style.cursor="move";
            }else{
                that.canvas.style.cursor="default";
                return;
            }
            that.canvas.onmousemove = function(e){
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history!=0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endx= e.offsetX;
                var endy= e.offsetY;
                var lefts=endx-cx;
                var tops=endy-cy;
                if (lefts < 0) {
                    lefts = 0;
                }
                if (lefts > that.width - w) {
                    lefts = that.width - w;
                }
                if (tops < 0) {
                    tops = 0;
                }
                if (tops > that.height - h) {
                    tops = that.height - h;
                }
                selectareaobj.css({
                   left:lefts,
                    top:tops
                })
                x=lefts;
                y=tops;
                that.cobj.putImageData(that.temp,lefts,tops);
            }
            that.canvas.onmouseup = function(){
                that.canvas.onmouseup=null;
                that.canvas.onmousemove=null;
                that.drag(x,y,w,h,selectareaobj);
            }
        }
    }
}