import Scene from "../canvas/Scene";
import { deg2rad } from "../utils/MathUtils";
import { RotatingArc } from "../canvas/shapes/arcs";

const drawLine = (context, x, y, length, angle) => {
    context.save();
    context.beginPath();

    context.translate(x, y);
    context.rotate(angle);

    context.moveTo(-length / 2, 0);
    context.lineTo(length / 2, 0);
    context.stroke();

    context.closePath();
    context.restore();
};

export default class Scenario extends Scene {
    constructor(id) {
        super(id);

        
        this.drawGradation();

        
        this.arcs = [];
        this.nArcs = 10;
        for (let i = 0; i < this.nArcs; i++) {
            const arc_ = new RotatingArc(
                this.width / 2,
                this.height / 2,
                this.mainRadius + (i - this.nArcs / 2) * this.deltaRadius,
                i != 0 && i != this.nArcs - 1 ? deg2rad(Math.random() * 360) : 0,
                i != 0 && i != this.nArcs - 1 ? deg2rad(Math.random() * 360) : deg2rad(360)
            );
            this.arcs.push(arc_);
        }

        this.params['line-width'] = 2;
        this.params.speed = 1;
        this.params.color = "#ffffff";
        if (this.debug.active) {
            this.debugFolder.add(this.params, 'line-width', 1, 10).onChange(() => this.drawUpdate());
            this.debugFolder.add(this.params, 'speed', -2, 2, .25);
            this.debugFolder.addColor(this.params, 'color');
        }
    }

    resize() {
        super.resize();

        
        this.mainRadius = Math.min(this.width, this.height) * .5 * .65;
        this.deltaRadius = this.mainRadius * .075;

        
        if (!!this.arcs) {
            this.arcs.forEach((e, index) => {
                e.x = this.width / 2;
                e.y = this.height / 2;
                e.radius = this.mainRadius + (index - this.arcs.length / 2) * this.deltaRadius;
            });
        }

        
        this.drawUpdate();
    }

    update() {
        if (!super.update()) return;
        this.drawUpdate();
    }

    drawUpdate() {
        this.clear();

        
        this.context.lineCap = 'round';
        this.context.strokeStyle = this.params.color;
        this.context.lineWidth = this.params['line-width'];

        this.drawGradation();

        this.drawClock();

        if (!!this.arcs) {
            this.arcs.forEach(arc => {
                if (this.params["is-update"]) arc.update(this.globalContext.time.delta / 1000, this.params.speed);
                arc.draw(this.context);
            });
        }
    }

    drawGradation() {
        const nGradation = 12;
        for (let i = 0; i < nGradation; i++) {
            const angle = 2 * Math.PI * i / nGradation + Math.PI / 2;
            const x = this.width / 2 + (this.mainRadius - this.deltaRadius / 2) * Math.cos(angle);
            const y = this.height / 2 + (this.mainRadius - this.deltaRadius / 2) * Math.sin(angle);
            const length = this.deltaRadius * (this.nArcs - 1);
            drawLine(this.context, x, y, length, angle);
        }
    }

    drawClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const clockRadius = Math.min(this.width, this.height) * 0.4;
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        
        this.context.beginPath();
        this.context.arc(centerX, centerY, clockRadius, 0, Math.PI * 2);
        this.context.stroke();
        this.context.closePath();

        
        this.drawHand(centerX, centerY, hours / 12 * 360 + (30 * minutes / 60), clockRadius * 0.5, 8); 
        this.drawHand(centerX, centerY, minutes / 60 * 360 + (6 * seconds / 60), clockRadius * 0.7, 4); 
        this.drawHand(centerX, centerY, seconds / 60 * 360, clockRadius * 0.8, 1, "white"); 
    }

    drawHand(centerX, centerY, angle, length, width, color = "black") {
        const radians = deg2rad(angle - 90);
        const endX = centerX + length * Math.cos(radians);
        const endY = centerY + length * Math.sin(radians);

        this.context.beginPath();
        this.context.moveTo(centerX, centerY);
        this.context.lineTo(endX, endY);
        this.context.strokeStyle = color;
        this.context.lineWidth = width;
        this.context.stroke();
        this.context.closePath();
    }
    drawClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const clockRadius = Math.min(this.width, this.height) * 0.4;
        const centerX = this.width / 2;
        const centerY = this.height / 2;
    
        
        this.context.beginPath();
        this.context.arc(centerX, centerY, clockRadius, 0, Math.PI * 2);
        this.context.stroke();
        this.context.closePath();
    
        
        const numberRadius = clockRadius * 1;
        const numberSize = 10; 
        const numberColor = "black"; 
        for (let i = 1; i <= 12; i++) {
            const angle = deg2rad(i * 30 - 90);
            const x = centerX + numberRadius * Math.cos(angle);
            const y = centerY + numberRadius * Math.sin(angle);
            this.drawNumberObject(x, y, numberSize, numberColor);
        }
    
        
        this.drawHand(centerX, centerY, hours / 12 * 360 + (30 * minutes / 60), clockRadius * 0.5, 8); 
        this.drawHand(centerX, centerY, minutes / 60 * 360 + (6 * seconds / 60), clockRadius * 0.7, 4); 
        this.drawHand(centerX, centerY, seconds / 60 * 360, clockRadius * 0.8, 1, "white"); 
    }
    
    drawNumberObject(x, y, size, color) {
        
        this.context.beginPath();
        this.context.arc(x, y, size, 0, Math.PI * 2);
        this.context.fillStyle = color;
        this.context.fill();
        this.context.closePath();
    }
    
    
}
