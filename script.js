const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const SCALE_X = 40;
const SCALE_Y = 30;

let points = [];

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.round((event.clientX - rect.left) / SCALE_X);
    const y = Math.round((event.clientY - rect.top) / SCALE_Y);

    if (points.length === 3) {
        points = [];
    }

    points.push({ x, y });

    drawPoints();

    if (points.length === 2 || points.length === 3) {
        displayInfo();
    }
});

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.round((event.clientX - rect.left) / SCALE_X);
    const y = Math.round((event.clientY - rect.top) / SCALE_Y);

    document.getElementById('cursorPosition').innerText = `Posición del cursor: (${x}, ${y})`;
});

function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach(point => {
        const x = point.x * SCALE_X;
        const y = point.y * SCALE_Y;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();

        ctx.font = '12px Arial';
        ctx.fillText(`(${point.x}, ${point.y})`, x + 10, y - 10);
    });

    if (points.length === 2) {
        const x1 = points[0].x * SCALE_X;
        const y1 = points[0].y * SCALE_Y;
        const x2 = points[1].x * SCALE_X;
        const y2 = points[1].y * SCALE_Y;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.closePath();
    } else if (points.length === 3) {
        const x1 = points[0].x * SCALE_X;
        const y1 = points[0].y * SCALE_Y;
        const x2 = points[1].x * SCALE_X;
        const y2 = points[1].y * SCALE_Y;
        const x3 = points[2].x * SCALE_X;
        const y3 = points[2].y * SCALE_Y;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }
}

function displayInfo() {
    if (points.length >= 2) {
        const [point1, point2] = points;
        const distance = calculateDistance(point1, point2);

        document.getElementById('point1').innerText = `Punto 1: (${point1.x}, ${point1.y})`;
        document.getElementById('point2').innerText = `Punto 2: (${point2.x}, ${point2.y})`;
        document.getElementById('distance').innerText = `Distancia: ${distance.toFixed(2)}`;
    }

    if (points.length === 3) {
        const point3 = points[2];
        document.getElementById('point3').innerText = `Punto 3: (${point3.x}, ${point3.y})`;
    } else {
        document.getElementById('point3').innerText = '';
    }
}

document.getElementById('verifyBtn').addEventListener('click', () => {
    const property = document.getElementById('property').value;
    verifyProperty(property);
});

function verifyProperty(property) {
    if (points.length < 2) {
        document.getElementById('verification').innerText = 'Necesitas seleccionar al menos dos puntos.';
        document.getElementById('explanation').innerText = '';
        return;
    }

    const [point1, point2] = points;
    const distance = calculateDistance(point1, point2);
    let result = '';
    let explanation = '';

    if (property === 'positividad') {
        const cumplePositividad = distance >= 0 && (distance === 0 ? point1.x === point2.x && point1.y === point2.y : true);
        result = `Cumple positividad: ${cumplePositividad}`;
        explanation = `d = sqrt((${point2.x} - ${point1.x})^2 + (${point2.y} - ${point1.y})^2) = ${distance.toFixed(2)}.\n` +
                      (cumplePositividad ? 
                      'La distancia entre dos puntos siempre es positiva, excepto cuando los puntos son iguales, en cuyo caso la distancia es cero.' : 
                      'La distancia no cumple positividad, lo cual es raro porque las distancias no deberían ser negativas.');
    } else if (property === 'simetria') {
        const dist1 = calculateDistance(point1, point2);
        const dist2 = calculateDistance(point2, point1);
        const cumpleSimetria = dist1 === dist2;
        result = `Cumple simetría: ${cumpleSimetria}`;
        explanation = `d(Punto1, Punto2) = sqrt((${point2.x} - ${point1.x})^2 + (${point2.y} - ${point1.y})^2) = ${dist1.toFixed(2)}.\n` +
                      `d(Punto2, Punto1) = sqrt((${point1.x} - ${point2.x})^2 + (${point1.y} - ${point2.y})^2) = ${dist2.toFixed(2)}.\n` +
                      (cumpleSimetria ? 
                      'La distancia entre dos puntos es la misma en ambos sentidos.' : 
                      'La distancia no cumple simetría, lo cual es raro porque las distancias deberían ser simétricas.');
    } else if (property === 'triangular') {
        if (points.length < 3) {
            document.getElementById('verification').innerText = 'Necesitas seleccionar tres puntos para verificar la desigualdad triangular.';
            document.getElementById('explanation').innerText = '';
            return;
        }
        const point3 = points[2];
        const d1 = calculateDistance(point1, point2);
        const d2 = calculateDistance(point2, point3);
        const d3 = calculateDistance(point1, point3);
        const cumpleTriangular = d3 <= d1 + d2;
        result = `Cumple desigualdad triangular: ${cumpleTriangular}`;
        explanation = `d(Punto1, Punto3) = sqrt((${point3.x} - ${point1.x})^2 + (${point3.y} - ${point1.y})^2) = ${d3.toFixed(2)}.\n` +
                      `d(Punto1, Punto2) = sqrt((${point2.x} - ${point1.x})^2 + (${point2.y} - ${point1.y})^2) = ${d1.toFixed(2)}.\n` +
                      `d(Punto2, Punto3) = sqrt((${point3.x} - ${point2.x})^2 + (${point3.y} - ${point2.y})^2) = ${d2.toFixed(2)}.\n` +
                      (cumpleTriangular ? 
                      `La distancia entre dos puntos es menor o igual a la suma de las distancias entre cada par de puntos que se pueden formar con esos tres puntos.` : 
                      `La distancia no cumple la desigualdad triangular, lo cual es raro porque las distancias deberían cumplir esta propiedad.`);
    } else {
        result = 'Propiedad no válida';
        explanation = 'Selecciona una propiedad válida para verificar.';
    }

    document.getElementById('verification').innerText = result;
    document.getElementById('explanation').innerText = explanation;
}

function calculateDistance(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}
