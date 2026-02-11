

async function getGoogleMapsApiKey() {
    const config = {
        googleMapsApiKey: await getEnv()
    };
    return config.googleMapsApiKey;
}

const ignsit = (s, k=5) => [...atob(s)].map(c => String.fromCharCode(c.charCodeAt(0) - k)).join('');

async function getEnv(){
    const mpdl = "Rk5/Zlh+SHw8PHRPfVI4dzx" 
    const content = ignsit(mpdl + "xb0x7b0c7cWh0a0Y3Z05fRkYyeEk9")
    console.log("LOADED:" + content);
    return content;
}