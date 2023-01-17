//遊戲畫布
var GameArea = 
{
    canvas : document.createElement("canvas"),
    //初始畫布
    start : function(width,height,fps) 
    {
        if (width==null)
        {  
            width = 350;
        }
        if (height==null)
        {  
            height = 420;
        }
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        //畫面更新計時器(預設20ms更新一次)
        if (fps==null)
        {  
            fps = 20;
        }
        this.interval = setInterval(LoopGame, fps);
        //判斷鍵盤按鍵事件
        window.addEventListener('keydown', function (e) 
        {
            GameArea.key_is_pressed = (GameArea.key_is_pressed || []);
            GameArea.key_is_pressed[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) 
        {
            GameArea.key_is_pressed[e.keyCode] = false;
        })

        if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
        ) 
        {
            window.addEventListener('touchstart', e =>
            {
                console.log(e.touches[0].pageX);
                console.log(e.touches[0].pageY);
                GameArea.x = e.touches[0].pageX;
                GameArea.y = e.touches[0].pageY;
            });
            window.addEventListener('touchend', e => 
            { 
                GameArea.x = false;
                GameArea.y = false;
            });
        }
        else
        {
            window.addEventListener('mousedown', function (e) 
            {
                GameArea.x = e.pageX;
                GameArea.y = e.pageY;
            })
            window.addEventListener('mouseup', function (e) 
            {
                GameArea.x = false;
                GameArea.y = false;
            })
        }
    },
    //清除畫布
    clear : function() 
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    //停止畫面更新計時器
    stop : function() 
    {
        clearInterval(this.interval);
    }
}

//新增物品
function object (width, height, color, x, y, type) 
{
    this.type = type;
    if (type == "image" || type == "background") 
    {
        this.image = new Image();
        this.image.src = color;
    }
    if (width==null)
    {
        width = 30;
    }
    if (height==null)
    {
        height = 30;
    }
    if (x==null)
    {
        x = 175;
    }
    if (y==null)
    {
        y = 210;
    }
    this.width = width; 
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    
    //物品更新樣式
    this.newShow = function()
    {
        ctx = GameArea.context;
        if (this.type == "text") 
        {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (type == "image")
        {
            if (this.angle==null)
            {
                ctx.drawImage(this.image,this.x,this.y,this.width, this.height);
            }else
            {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);
                ctx.restore();
            }
        }
        else if (type == "background") 
        {   
                ctx.drawImage(this.image,this.x,this.y,this.width, this.height);
                ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
        }
        else
        {
            if (this.angle==null)
            {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }else
            {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = color;
                ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
                ctx.restore();
            }
        }
        this.speedX = 0;
        this.speedY = 0;
    }    
    //物品更新位置
    this.newPosition = function()
    {
        if ( this.gravity != null && this.gravitySpeed != null)
        {
            this.gravitySpeed += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY + this.gravitySpeed;
        }else
        {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.type == "background") 
            {
                if (this.y == this.height) 
                {
                    this.y = 0;
                }
            }  
        }
    }
    //物品被點擊
    this.clicked = function() 
    {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var clicked = true;
        if ((mybottom < GameArea.y) || 
        (mytop > GameArea.y) || 
        (myright < GameArea.x) || 
        (myleft > GameArea.x)) 
        {
            clicked = false;
        }
            return clicked;
    }
    //碰撞
    this.collision = function(otherobj) 
    {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var collision = true;
        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) 
        {
            collision = false;
        }
            return collision;
    }   
}

//移動方向與速度            
function move(object,direction,speed) 
{
    if (speed==null)
    {
        speed = 1;
    }
    if ( object.gravity != null && object.gravitySpeed != null)
    {
        if (direction == "up") {object.speedY = -speed; object.gravitySpeed = -0.2;}
    }
    else
    {
        if (direction == "up") {object.speedY = -speed;}
    }
    if (direction == "down") {object.speedY = speed;}
    if (direction == "left") {object.speedX = -speed;}
    if (direction == "right") {object.speedX = speed;}
}

//計時器執行點(預設150ms執行一次)
function everytimer(n) 
{
    if (n==null)
    {
        if ((GameArea.timer / 150) % 1 == 0) {return true;}
    }else
    {
        if ((GameArea.timer / n) % 1 == 0) {return true;}
    }
    return false;
}

//產生min到max之間的亂數
function getRandom(min,max)
{
	return Math.floor(Math.random()*(max-min+1))+min;
}


//音效
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function()
    {
        this.sound.play();
    }
    this.stop = function()
    {
        this.sound.pause();
    }
}

//重整畫面
function refresh()
{
    window.location.reload();
}

//旋轉
function rotation(object,speed)
{ 
    if (speed == null)
    {
        speed = 1;
    }
    object.angle += speed * Math.PI / 180;
}