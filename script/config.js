
const CONFIG = {
    BASE_URL: "__API_URL_PLACEHOLDER__"
};

if (CONFIG.BASE_URL.includes("PLACEHOLDER") || window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
    CONFIG.BASE_URL = "http://localhost:8080/api"; 
}

console.log("🚀 MiniStock API conectada em:", CONFIG.BASE_URL);