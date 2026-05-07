// Initialize Lucide Icons
lucide.createIcons();

// Three.js Background
const initThree = () => {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create a 3D Shape (Abstract Crystal/Sphere)
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshPhongMaterial({
        color: 0x10b981,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
    });
    
    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // Add another layer
    const innerGeometry = new THREE.IcosahedronGeometry(1.5, 0);
    const innerMaterial = new THREE.MeshPhongMaterial({
        color: 0xfbbf24,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
    });
    const innerCrystal = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerCrystal);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x10b981, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;

    // Scroll Interaction
    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        crystal.rotation.y += 0.002;
        crystal.rotation.x += 0.001;
        innerCrystal.rotation.y -= 0.003;
        
        // Scroll reactions
        const targetRotation = scrollY * 0.001;
        crystal.rotation.z = targetRotation;
        particlesMesh.rotation.y = targetRotation * 0.5;
        
        // Parallax effect
        camera.position.y = -scrollY * 0.002;

        renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// GSAP Animations
const initAnimations = () => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Fade In
    gsap.from('.hero-content > *', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out'
    });

    // Section Reveal
    const revealSections = document.querySelectorAll('.section');
    revealSections.forEach(section => {
        gsap.from(section.querySelectorAll('.glass-card, .skill-card, .timeline-item'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });
    });

    // Navbar Effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    initThree();
    initAnimations();
});

// Contact Form Mockup
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Message Sent!';
        btn.style.background = '#10b981';
        btn.style.color = '#fff';
        contactForm.reset();
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 3000);
    });
}
