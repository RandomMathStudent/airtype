export class Key{
 letter: string;
 x_pos : number; 
 y_pos : number;
 width : number = 10; //placeholder for now
 height : number = 10; //placeholder for now
 Pressed: boolean;

 constructor(letter: string, x_pos : number, y_pos : number){
  this.letter = letter;
  this.x_pos = x_pos;
  this.y_pos = y_pos;
  this.Pressed = false;
 }

draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, angle: number = 0) {
    ctx.save();
    // Move to the center of the key
    ctx.translate(this.x_pos + offsetX + this.width/2, this.y_pos + offsetY + this.height/2);
    ctx.rotate(angle);

    // Draw key background (centered)
    ctx.fillStyle = '#333';
    ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);

    // Draw letter
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.letter, 0, 0);

    ctx.restore();
}
}