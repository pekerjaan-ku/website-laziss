// Ini adalah file tambahan jika Anda ingin partikel di halaman tertentu
// Contoh: Partikel di footer atau section tertentu
// Anda bisa memanggilnya di main.js atau langsung di HTML

// Contoh: Partikel di footer
function initFooterParticles() {
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("footer-particles", {
            particles: {
                number: {
                    value: 30,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#ffffff"
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: 0.3,
                    random: true
                },
                size: {
                    value: 2,
                    random: true
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "bottom",
                    random: true,
                    straight: false,
                    out_mode: "out"
                }
            },
            interactivity: {
                events: {
                    onhover: {
                        enable: false
                    },
                    onclick: {
                        enable: false
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Panggil fungsi saat DOM siap
document.addEventListener('DOMContentLoaded', initFooterParticles);