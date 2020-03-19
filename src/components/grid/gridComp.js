import React, { useEffect } from 'react';
import './gridComp.css';

function Grid(props) {
    useEffect(() => {
        const canvas = document.getElementById("myGrid");
        const context = canvas.getContext("2d");
        canvas.width = 2000;
        canvas.height = 2000;
        const bw = canvas.width;
        const bh = canvas.height;
        context.lineWidth = 5;

        function drawBoard(context = document.getElementById("myGrid").getContext("2d")){
            for (let x = 0; x <= bw; x += 100) {
                context.moveTo(x, 0);
                context.lineTo(x, bh);
            }

            for (let y = 0; y <= bh; y += 100) {
                context.moveTo(0, y);
                context.lineTo(bw, y);
            }
            context.strokeStyle = "black" ;
            context.stroke();
        }

        function drawAxis(){
                context.beginPath();
                context.strokeStyle = 'red';
                context.moveTo(1000, 0);
                context.lineTo(1000, 2000);
                context.stroke();

                context.beginPath();
                context.strokeStyle = 'red';
                context.moveTo(0, 1000);
                context.lineTo(2000, 1000);
                context.stroke();
        }

        function axesNumbers() {
            context.font = "65px Calibri bold";
            context.fillStyle = "white";
            for (let x = 100; x <= 900; x += 100) {
                if (x !==1000) context.fillText(`${(x/100)-10}`, x-15, 985);
            }
            for (let x = 1100; x <= 1900; x += 100) {
                if (x !==1000) context.fillText(`${(x/100)-10}`, x+10, 1060);
            }
            for (let y = 100; y <= 900; y += 100) {
                if (y !==1000) context.fillText(`${10-(y/100)}`, 1015, y+15);
            }
            for (let y = 1100; y <= 1900; y += 100) {
                if (y !==1000) context.fillText(`${10-(y/100)}`, 930, y+15);
            }
        }
        
        drawBoard();    
        drawAxis();
        axesNumbers();  
    }, []);
    return (
      <div className="grid">
          <canvas id="myGrid"></canvas>
      </div>
    );
}

export {Grid}