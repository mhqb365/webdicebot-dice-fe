const URL = {
    DEV: 'http://localhost:8003',
    PROD: 'https://dice-be.webdicebot.xyz'
}

const API_URL = window.location.hostname == 'localhost' ? URL.DEV : URL.PROD

export default API_URL