const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "black"; // Fondo de color negro

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.isColliding = false; // Detecta colisiones
        this.dx = (Math.random() * 1 - 1) * this.speed; // Movimiento aleatorio en X
        this.dy = -Math.random() * this.speed; // Movimiento hacia arriba
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.isColliding ? "#0000FF" : this.color;
        context.fillStyle = 'white';
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);

        // Actualizar posición X
        this.posX += this.dx;
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx; // Cambiar dirección en X si choca con el borde
        }

        // Actualizar posición Y (mover hacia arriba)
        this.posY += this.dy;

        // Reiniciar el círculo justo fuera del canvas si llega al borde superior
        if (this.posY + this.radius < 0) {
            this.posY = window_height + this.radius; // Reiniciar justo fuera del canvas
        }
    }

    // Verificar si un punto (x, y) está dentro del círculo
    isPointInside(x, y) {
        const dist = Math.sqrt((x - this.posX) ** 2 + (y - this.posY) ** 2);
        return dist < this.radius;
    }
}

// Crear un array para almacenar círculos
let circles = [];

// Función para generar círculos aleatorios que se muevan de abajo hacia arriba
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = window_height + Math.random() * 100 + radius; // Comienza ligeramente fuera del borde inferior, para evitar amontonamiento
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
        let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5 (más variación)
        let text = `C${i + 1}`; // Etiqueta del círculo

        let newCircle = new Circle(x, y, radius, color, text, speed);

        // Asegurarse de que el nuevo círculo no se superponga con los ya existentes
        let isOverlapping = false;
        for (let j = 0; j < circles.length; j++) {
            if (detectCollision(newCircle, circles[j])) {
                isOverlapping = true;
                break;
            }
        }

        // Si no hay colisión, agregar el círculo
        if (!isOverlapping) {
            circles.push(newCircle);
        } else {
            i--; // Volver a intentar generar el círculo si hubo colisión
        }
    }
}

// Función para animar los círculos
function animate() {
    ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas
    checkCollisions(circles); // Verificar colisiones

    circles.forEach(circle => {
        circle.update(ctx); // Actualizar cada círculo
    });

    requestAnimationFrame(animate); // Repetir la animación
}

// Función para detectar colisiones entre círculos
function detectCollision(circle1, circle2) {
    const dx = circle1.posX - circle2.posX;
    const dy = circle1.posY - circle2.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
}

// Función para verificar colisiones entre círculos
function checkCollisions(circles) {
    for (let i = 0; i < circles.length; i++) {
        circles[i].isColliding = false; // Reiniciar el estado de colisión
        for (let j = i + 1; j < circles.length; j++) {
            if (detectCollision(circles[i], circles[j])) {
                circles[i].isColliding = true;
                circles[j].isColliding = true;

                // Invertir la dirección de ambos círculos en caso de colisión
                circles[i].dx = -circles[i].dx;
                circles[i].dy = -circles[i].dy;
                circles[j].dx = -circles[j].dx;
                circles[j].dy = -circles[j].dy;
            }
        }
    }
}

// Detectar el clic del mouse y eliminar círculos
canvas.addEventListener('click', function (event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Verificar si el clic está dentro de algún círculo y eliminarlo
    circles = circles.filter(circle => !circle.isPointInside(mouseX, mouseY));
});

// Generar círculos y comenzar la animación
generateCircles(10); // Puedes cambiar el número de círculos aquí
animate();


