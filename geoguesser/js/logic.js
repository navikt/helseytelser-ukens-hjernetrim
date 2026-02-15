let map;
let panorama;
let guessMarker;
let targetMarker;
let allowMarkerSet = true;
let dottedLine;
let sv;
let pointOfOrigin = { lat:  59.9121746, lng: 10.7312704 };
let currentRoundIndex = 0;
let currentTargetLatLng = null;
let roundScores = [];

const locations = [
    {
        latLng: { lat: 59.912281370398006, lng: 10.798321603497167 },
        shortDescription: "Ved Nav kontoret",
        description: "Nav kontor",
        pano: "yvcT8_sH41gHhru0mSCWww",
        JG: "//maps.google.com/maps/contrib/113056659489150386159"
    },
    {
        latLng: { lat: 59.91194460907636, lng: 10.733586435215393 },
        shortDescription: "Oslo City Hall",
        description: "Oslo City Hall",
        pano: "CAoSF0NJSE0wb2dLRUlDQWdJQzZyNTJvZ2dF",
        JG: "//maps.google.com/maps/contrib/110288797455515018625"
    },
    {
        latLng: { lat: 59.9369779, lng: 10.736941   },
        shortDescription: "Oslo University Hospital Ullevål",
        description: "Oslo University Hospital Ullevål",
        pano: "2Cqh4Z4InxpqrptrGot3Pg",
        JG: "//maps.google.com/maps/place/Oslo+University+Hospital+Ullev%C3%A5l"
    },
        {
        latLng: { lat: 59.929076829851866, lng: 10.748562506091226 },
        shortDescription: "Ilatrappen",
        description: "Ilatrappen",
        pano: "CAoSF0NJSE0wb2dLRUlDQWdJRFVrdlNEendF",
        JG: "//maps.google.com/maps/contrib/115385471507152016857"
    },
    {
        latLng: { lat: 59.92376601915641, lng: 10.753547463485237 },
        shortDescription: "Ahmad Syed Ijlal",
        description: "Vann ved grunerlookaa",
        pano: "CAoSFkNJSE0wb2dLRUlDQWdJRHE3ZnFMRnc.",
        JG: "//maps.google.com/maps/contrib/110785428595926066679"
    },

];

const MAX_SCORE = 5000;
const MAX_DISTANCE_KM = 4;



const winPhrases = [
    "Fulltreffer!",
    "Perfekt!",
    "Midt i blinken!",
    "Helt presist!",
    "Sterkt!",
    "Du er i flyt!",
    "Knallbra!",
    "Flott gjetning!"
];

const closePhrases = [
    "Ikke verst!",
    "Nære på!",
    "Nesten der!",
    "Imponerende nær!",
    "Så å si treff!",
    "Du er på rett spor!"
];

const farAwayPhrases = [
    "Det var et stykke unna.",
    "Litt på utsiden.",
    "Fint forsøk!",
    "Ikke helt denne gangen.",
    "Vi prøver igjen!",
    "Bra innsats!"
];

const veryFarAwayPhrases = [
    "Godt forsøk, men et godt stykke unna.",
    "Litt for langt denne gangen.",
    "Her var vi et godt stykke unna.",
    "Neste runde blir bedre!",
    "Ganske langt unna, men fint forsøk!",
    "Vi tar en ny sjanse!",
];



function adjustLayout() { // Adjust layout on resize
    var map = document.getElementById("map");
    var pano = document.getElementById("pano");

    if (window.innerWidth - (window.innerWidth * 22 / 100) < window.innerHeight) {
        map.style.width = "100%";
        map.style.float = "none";
        pano.style.width = "100%";
        pano.style.float = "none";
        map.style.height = "50%";
        pano.style.height = "50%";
    } else {
        map.style.width = "50%";
        map.style.float = "left";
        pano.style.width = "50%";
        pano.style.float = "left";
        map.style.height = "100%";
        pano.style.height = "100%";
    }
}

function haversineDistance(lat1, lon1, lat2, lon2) { // Calculate kilometer distance between two coordinates
    const R = 6371;
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    return distance;
}

function degToRad(deg) {
    return deg * (Math.PI / 180);
}

function generateRandomCoordMap() { // Generate random coordinates within map bounds
    const bounds = map.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    // Calculate the center of the map bounds
    const centerLat = (northEast.lat() + southWest.lat()) / 2;
    const centerLng = (northEast.lng() + southWest.lng()) / 2;

    // Generate random offsets using a normal distribution
    const latOffset = generateRandomOffset();
    const lngOffset = generateRandomOffset();

    // Apply the offsets to the center coordinates
    const lat = centerLat + latOffset * (northEast.lat() - southWest.lat());
    const lng = centerLng + lngOffset * (northEast.lng() - southWest.lng());

    return { lat: lat, lng: lng };
}

function generateRandomOffset() { // Generate random offset using a normal distribution
    const stdDev = 0.2;
    let offset = 0;

    for (let i = 0; i < 8; i++) {
        offset += Math.random();
    }

    offset -= 3;
    offset *= stdDev;
    return offset;
}

function getCityNameByLatLng(latitude, longitude, callback) { // Get city name by coordinates
    var latlng = new google.maps.LatLng(latitude, longitude);
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: latlng }, function (results, status) {
        if (status === "OK") {
            if (results[0]) {
                for (var i = 0; i < results[0].address_components.length; i++) {
                    var types = results[0].address_components[i].types;
                    if (types.includes("locality")) {
                        var city = results[0].address_components[i].long_name;
                        callback(city);
                        return;
                    }
                }
                callback(null); // City not found
            } else {
                callback(null); // No results found
            }
        } else {
            callback(null); // Geocoder failed
        }
    });
}

function getCityCornerCoordinates(centerPoint) { // Get city corner coordinates by city center coordinates
    const distanceToFarthestPoint = google.maps.geometry.spherical.computeDistanceBetween(centerPoint, map.getBounds().getNorthEast());
    const cityRadius = Math.round(distanceToFarthestPoint);

    const cityNorthEast = google.maps.geometry.spherical.computeOffset(centerPoint, cityRadius, 45);
    const citySouthWest = google.maps.geometry.spherical.computeOffset(centerPoint, cityRadius, 225);

    return { northEast: cityNorthEast, southWest: citySouthWest };
}

function calculateScore(distanceKm) {
    if (distanceKm < 0.03) {
        return MAX_SCORE;
    }
    const clampedDistance = Math.min(distanceKm, MAX_DISTANCE_KM);
    const score = MAX_SCORE * (1 - clampedDistance / MAX_DISTANCE_KM);
    return Math.max(0, Math.round(score));
}

function resetRoundState() {
    allowMarkerSet = true;
    if (guessMarker !== null && guessMarker !== undefined) {
        guessMarker.setMap(null);
        guessMarker = null;
    }
    if (dottedLine !== null && dottedLine !== undefined) {
        dottedLine.setMap(null);
        dottedLine = null;
    }
    if (targetMarker !== null && targetMarker !== undefined) {
        targetMarker.setMap(null);
        targetMarker = null;
    }
}

function setMapToCityBounds() {
    map.panTo(pointOfOrigin);
    map.setZoom(14);

    const cornerCoordinates = getCityCornerCoordinates(pointOfOrigin);
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(cornerCoordinates.northEast);
    bounds.extend(cornerCoordinates.southWest);
    map.fitBounds(bounds);
}

function getGameRoundIndex() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('game_round_index='));
    const gameRoundIndex = cookie ? parseInt(cookie.split('=')[1]) : null;
    console.log("COOKIE:", gameRoundIndex);
    return gameRoundIndex
}

function startRound(roundIndex) {
    if (roundIndex >= locations.length) {
        showEndScreen();
        return;
    }

    currentRoundIndex = roundIndex;
    updateRoundIndicator();
    resetRoundState();
    setMapToCityBounds();

    const location = locations[roundIndex];
    currentTargetLatLng = location.latLng;

    processSVData(location)

    document.getElementById("guessBtn").innerHTML = "Gjett!";
}

function updateRoundIndicator() {
    const roundIndicator = document.getElementById("roundIndicator");
    if (!roundIndicator) {
        return;
    }

    roundIndicator.textContent = "Runde " + (currentRoundIndex + 1);
    roundIndicator.classList.remove("hidden");
}


async function initialize() { // Initialize

    map = new google.maps.Map(document.getElementById("map"), { // Initialize map
        center: pointOfOrigin,
        zoom: 14,
        streetViewControl: false,
        mapId: 'd4fe02c4af5e4ff6',
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        tilt: 0,
        disableDefaultUI: true
    });

    google.maps.event.addListenerOnce(map, 'idle', function () {
        sv = new google.maps.StreetViewService();

        panorama = new google.maps.StreetViewPanorama(
            document.getElementById("pano")
        );

        panorama.setOptions({
            showRoadLabels: false,
            addressControl: false,
            streetViewControl: false,
            source: google.maps.StreetViewSource.OUTDOOR,
            motionTracking: false,
            motionTrackingControl: false
        });

        startRound(0);
    });

    $('#introductionModal').modal('show');

    map.addListener("click", (event) => { // Add marker on click
        if (!allowMarkerSet) {
            return;
        }

        const playDropAnimation = !guessMarker;

        if (guessMarker !== null && guessMarker !== undefined) {
            guessMarker.setAnimation(null);
            guessMarker.setMap(null);
        }

        guessMarker = new google.maps.Marker({
            position: event.latLng,
            map,
            title: 'Gjett',
            animation: playDropAnimation ? google.maps.Animation.DROP : null,
            draggable: true,
        });
        map.panTo(event.latLng);

        if (playDropAnimation) {
            google.maps.event.addListenerOnce(guessMarker, 'animation_changed', function () {
                guessMarker.setAnimation(google.maps.Animation.BOUNCE);
            });
        }
        if (guessMarker.getAnimation() == null) {
            guessMarker.setAnimation(google.maps.Animation.BOUNCE);
        }
    });
}


function processSVData(location) { // Process street view data
    //const location = data.location;
    currentTargetLatLng = {
        lat: location.latLng.lat,
        lng: location.latLng.lng
    };

    panorama.setPano(location.pano);
    const heading = 287;

    panorama.setPov({
        heading: heading,
        pitch: 0,
    });
    panorama.setVisible(true);
}

function showEndScreen() {
    const endScreen = document.getElementById("endScreen");
    const totalScoreText = document.getElementById("totalScoreText");
    const guessBtn = document.getElementById("guessBtn");
    const roundIndicator = document.getElementById("roundIndicator");

    if (guessBtn) {
        guessBtn.disabled = true;
    }

    const totalScore = roundScores.reduce((sum, value) => sum + value, 0);
    totalScoreText.innerHTML = "Total poengsum: " + totalScore;

    endScreen.classList.add("active");

    if (roundIndicator) {
        roundIndicator.classList.add("hidden");
    }
}

function generateSlackMessage() {
    console.log("Generating Slack message...");
    const teamNameInput = document.getElementById("teamNameInput");
    const slackOutput = document.getElementById("slackOutput");
    const name = teamNameInput.value.trim() || "Anonym";
    const totalScore = roundScores.reduce((sum, value) => sum + value, 0)
    
    slackOutput.classList.remove("hidden");
    document.getElementById("slackInfoKopier").classList.remove("hidden");

    const lines = [];
    lines.push("Team: " + name);
    for (let i = 0; i < locations.length; i++) {
        const score = roundScores[i] !== undefined ? roundScores[i] : 0;
        lines.push(getScoreEmoji(score) + (i + 1) + ": " + score);
    }
    lines.push("Totalt: " + totalScore);
    lines.push("Uke 7 - Oslo steder");

    slackOutput.value = lines.join("\n");
}

function getScoreEmoji(score) {
    if (score >= 4700) {
        return "🟩";
    }
    if (score >= 3500) {
        return "🟨";
    }
    if (score >= 2500) {
        return "🟧";
    }
    return "⬛";
}

async function guessBtnClick() { // Guess button click
    let resultModalCenterTitle = document.getElementById("resultModalCenterTitle");
    let resultModalCenterText = document.getElementById("resultModalCenterText");

    if (!guessMarker) { // No marker set
        resultModalCenterTitle.innerHTML = "Oisann!";
        resultModalCenterText.innerHTML = "Sett en markør først!";
        $('#resultModalCenter').modal('show');
        return;
    }

    if (!allowMarkerSet) { // Start next round
        startRound(currentRoundIndex + 1);
        return;
    }

    allowMarkerSet = false;
    guessMarker.setAnimation(null);
    guessMarker.setDraggable(false);
    const isLastRound = currentRoundIndex === locations.length - 1;
    document.getElementById("guessBtn").innerHTML = isLastRound ? "Ferdig" : "Neste runde";

    // Draw target marker
    if (targetMarker) {
        targetMarker.setMap(null);
    }
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const pinBackground = new PinElement({
        background: "#06d102",
        borderColor: "#199140",
        glyphColor: "#199140",
    });
    targetMarker = new AdvancedMarkerElement({
        position: currentTargetLatLng,
        map,
        title: 'Mål',
        content: pinBackground.element,
    });

    // Draw dotted line between markers
    const lineSymbol = {
        path: "M 0,-1 0,1",
        strokeOpacity: 1,
        scale: 4,
    };
    dottedLine = new google.maps.Polyline({
        path: [
            { lat: currentTargetLatLng.lat, lng: currentTargetLatLng.lng },
            { lat: guessMarker.getPosition().lat(), lng: guessMarker.getPosition().lng() },
        ],
        strokeColor: "#c0e2fc",
        strokeOpacity: 0,
        icons: [
            {
                icon: lineSymbol,
                offset: "0",
                repeat: "20px",
            },
        ],
        map: map,
    });

    // Zoom out to have both markers in view
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(currentTargetLatLng);
    bounds.extend(guessMarker.getPosition());
    map.fitBounds(bounds);

    const distance = haversineDistance(
        currentTargetLatLng.lat,
        currentTargetLatLng.lng,
        guessMarker.getPosition().lat(),
        guessMarker.getPosition().lng()
    );
    const distanceMeters = Math.round(distance * 1000);
    const points = calculateScore(distance);
    roundScores[currentRoundIndex] = points;

    resultModalCenterText.innerHTML = "Du var " + distanceMeters + " m unna. Du fikk " + points + " poeng.";
    if (distance < 0.05) {
        resultModalCenterTitle.innerHTML = winPhrases[Math.floor(Math.random() * winPhrases.length)];
        startConfetti();
        setTimeout(function () { stopConfetti(); }, 4000);
    } else if (distance < 0.12) {
        resultModalCenterTitle.innerHTML = winPhrases[Math.floor(Math.random() * winPhrases.length)];
        startConfetti();
        setTimeout(function () { stopConfetti(); }, 3000);
    } else if (distance < 0.75) {
        resultModalCenterTitle.innerHTML = closePhrases[Math.floor(Math.random() * closePhrases.length)];
    } else if (distance > 3.0) {
        resultModalCenterTitle.innerHTML = veryFarAwayPhrases[Math.floor(Math.random() * veryFarAwayPhrases.length)];
    } else {
        resultModalCenterTitle.innerHTML = farAwayPhrases[Math.floor(Math.random() * farAwayPhrases.length)];
    }

    $('#resultModalCenter').modal('show');
}

document.addEventListener("DOMContentLoaded", function () {
    const generateSlackBtn = document.getElementById("generateSlackBtn");
    if (generateSlackBtn) {
        generateSlackBtn.addEventListener("click", generateSlackMessage);
    }
});

async function loadGoogleScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${await getGoogleMapsApiKey()}&libraries=places,geometry&callback=initialize&v=weekly`;
    script.defer = true;
    document.head.appendChild(script);
}

loadGoogleScript();

window.addEventListener("resize", adjustLayout);
window.addEventListener("load", adjustLayout);
window.initialize = initialize;