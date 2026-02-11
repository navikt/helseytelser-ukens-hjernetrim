

async function getGoogleMapsApiKey() {
    const config = {
        googleMapsApiKey: await getEnv()
    };
    return config.googleMapsApiKey;
}

async function getEnv(){
    const response = await fetch("/JESPER_SIN_GMAPS_API_KEY");
    const content = await response.text();
    console.log("LOADED:" + content);
    return content;
}