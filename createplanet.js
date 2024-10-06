// Set up the scene, camera, and renderer
let scene, camera, renderer, planet, light;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, 500);
    document.getElementById('planetSimulation').appendChild(renderer.domElement);

    light = new THREE.PointLight(0xffffff, 1, 500);
    light.position.set(10, 0, 25);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    animate();
}

function getRandomTexture(biome) {
    const textures = {
        'ice': ['textures/ice_texture1.jpg', 'textures/ice_texture2.jpg', 'textures/ice_texture3.jpg'],
        'desert': ['textures/desert_texture1.jpg', 'textures/desert_texture2.jpg', 'textures/desert_texture3.jpg'],
        'gas': ['textures/gas_texture1.jpg', 'textures/gas_texture2.jpg', 'textures/gas_texture3.jpg'],
        'rocky': ['textures/rocky_texture1.jpg', 'textures/rocky_texture2.jpg', 'textures/rocky_texture3.jpg']
    };
    const selectedTextures = textures[biome] || [];
    return selectedTextures[Math.floor(Math.random() * selectedTextures.length)];
}

function createPlanetMesh(radius, biome) {
    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const texturePath = getRandomTexture(biome);
    const texture = textureLoader.load(texturePath);
    const material = new THREE.MeshPhongMaterial({ map: texture });

    return new THREE.Mesh(geometry, material);
}

function generatePlanet() {
    if (planet) {
        scene.remove(planet);
        planet.geometry.dispose();
        planet.material.dispose();
    }

    const biome = document.getElementById('biome').value;
    const radius = parseFloat(document.getElementById('size').value);

    planet = createPlanetMesh(radius, biome);
    scene.add(planet);

    fetchPlanetData();
}

function fetchPlanetData() {
    // Using a different API that doesn't require complex setup
    const apiUrl = `https://api.le-systeme-solaire.net/rest/bodies`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const planetData = data.bodies.filter(body => body.isPlanet);
            const randomPlanet = planetData[Math.floor(Math.random() * planetData.length)];
            displayPlanetDetails(randomPlanet);
        })
        .catch(error => {
            console.error('Error fetching planet data:', error);
            document.getElementById('exoplanetDetails').innerHTML = `Error fetching planet data: ${error.message}`;
        });
}
// Predefined dataset of exoplanets
const exoplanetData = [
    {
        name: "Kepler-22b",
        radius: 2.4,
        mass: 8.7,
        temperature: 295,
        gravity: 2.0,
        atmosphere: "Nitrogen, Oxygen, Carbon Dioxide"
    },
    {
        name: "Gliese 581g",
        radius: 1.5,
        mass: 3.1,
        temperature: 230,
        gravity: 1.3,
        atmosphere: "Carbon Dioxide, Methane"
    },
    {
        name: "TRAPPIST-1d",
        radius: 0.8,
        mass: 0.7,
        temperature: 255,
        gravity: 0.9,
        atmosphere: "Hydrogen, Helium"
    }
];

function generatePlanet() {
    if (planet) {
        scene.remove(planet);
        planet.geometry.dispose();
        planet.material.dispose();
    }

    const biome = document.getElementById('biome').value;
    const radius = parseFloat(document.getElementById('size').value);

    planet = createPlanetMesh(radius, biome);
    scene.add(planet);

    displayRandomExoplanetDetails();
}

function displayRandomExoplanetDetails() {
    const randomIndex = Math.floor(Math.random() * exoplanetData.length);
    const exoplanet = exoplanetData[randomIndex];

    const detailsHtml = `
        <h3>Matching Exoplanet Details:</h3>
        <p><strong>Name:</strong> ${exoplanet.name}</p>
        <p><strong>Radius (Earth radii):</strong> ${exoplanet.radius}</p>
        <p><strong>Mass (Earth mass):</strong> ${exoplanet.mass}</p>
        <p><strong>Temperature (K):</strong> ${exoplanet.temperature}</p>
        <p><strong>Gravity (relative to Earth):</strong> ${exoplanet.gravity}</p>
        <p><strong>Atmospheric Composition:</strong> ${exoplanet.atmosphere}</p>
    `;
    document.getElementById('exoplanetDetails').innerHTML = detailsHtml;
}

function displayPlanetDetails(planet) {
    const detailsHtml = `
        <h3>Matching Celestial Body Details:</h3>
        <p><strong>Name:</strong> ${planet.englishName || 'Unknown'}</p>
        <p><strong>Mean Radius (km):</strong> ${planet.meanRadius || 'Unknown'}</p>
        <p><strong>Mass (kg):</strong> ${planet.mass ? planet.mass.massValue + ' x 10^' + planet.mass.massExponent : 'Unknown'}</p>
        <p><strong>Gravity (m/s²):</strong> ${planet.gravity || 'Unknown'}</p>
        <p><strong>Orbital Period (days):</strong> ${planet.sideralOrbit || 'Unknown'}</p>
    `;
    document.getElementById('exoplanetDetails').innerHTML = detailsHtml;
}

function animate() {
    requestAnimationFrame(animate);

    if (planet) {
        planet.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

document.getElementById('generatePlanet').addEventListener('click', generatePlanet);
init();
