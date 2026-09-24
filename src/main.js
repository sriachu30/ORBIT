
import L from "leaflet";
import "../style.css";

const API_URL =
  "https://api.wheretheiss.at/v1/satellites/25544";

const REFRESH_INTERVAL = 5000;

// Initialize the map.
const map = L.map("map", {
  worldCopyJump: true,
}).setView([20, 0], 2);


 // Ground-track history: 120 readings = approximately 10 minutes.
const MAX_TRACK_POINTS = 120;

const trackHistory = [];
// Leaflet polylines currently displayed on the map.
let trackLines = [];

const trackTimestamps = [];
let lastSuccessfulUpdate = null;

// Add the map tiles.

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
    noWrap: true,
  }).addTo(map);

// Create a marker that we will move as the ISS travels.

const issIcon = L.divIcon({
  className: "iss-div-icon",

  html: `
    <div class="iss-marker">
      <div class="iss-marker-glow"></div>

      <svg
        class="iss-satellite"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <g transform="rotate(-35 50 50)">
          <!-- Left solar panel -->
          <rect
            x="5" y="34" width="25" height="32" rx="3"
            fill="#7dd3fc" stroke="#e0f2fe" stroke-width="2"
          />
          <path
            d="M13 34V66 M21 34V66 M5 50H30"
            stroke="#164e78" stroke-width="2"
          />

          <!-- Right solar panel -->
          <rect
            x="70" y="34" width="25" height="32" rx="3"
            fill="#7dd3fc" stroke="#e0f2fe" stroke-width="2"
          />
          <path
            d="M78 34V66 M86 34V66 M70 50H95"
            stroke="#164e78" stroke-width="2"
          />

          <!-- Station body -->
          <rect
            x="30" y="39" width="40" height="22" rx="6"
            fill="#e2e8f0" stroke="#ffffff" stroke-width="2"
          />

          <rect
            x="43" y="43" width="14" height="14" rx="3"
            fill="#64748b"
          />

          <!-- Antennas -->
          <path
            d="M50 39V28 M50 61V72 M30 50H23 M70 50H77"
            stroke="#e2e8f0"
            stroke-width="3"
            stroke-linecap="round"
          />

          <circle cx="50" cy="28" r="3" fill="#38bdf8"/>
          <circle cx="50" cy="72" r="3" fill="#38bdf8"/>
        </g>
      </svg>

      <div class="iss-marker-core"></div>
    </div>
  `,

  iconSize: [48, 48],
  iconAnchor: [24, 24],
  popupAnchor: [0, -24],
});

const issMarker = L.marker([0, 0], {
  icon: issIcon,
}).addTo(map);

issMarker.bindPopup("International Space Station");


function updateGroundTrack() {
  // Remove the previous trail layers before redrawing.
  trackLines.forEach((line) => {
    map.removeLayer(line);
  });

  trackLines = [];

  // Split the history into separate segments if the ISS
  // crosses the antimeridian (+180° / -180° longitude).
  const segments = [];
  let currentSegment = [];

  for (let i = 0; i < trackHistory.length; i++) {
    const point = trackHistory[i];

    if (currentSegment.length > 0) {
      const previousPoint =
        currentSegment[currentSegment.length - 1];

      const longitudeDifference =
        Math.abs(point[1] - previousPoint[1]);

      // A longitude jump greater than 180° indicates a
      // crossing of the antimeridian.
      if (longitudeDifference > 180) {
        if (currentSegment.length >= 2) {
          segments.push(currentSegment);
        }

        currentSegment = [];
      }
    }

    currentSegment.push(point);
  }

  // Include the final segment.
  if (currentSegment.length >= 2) {
    segments.push(currentSegment);
  }

  // Draw each segment as its own Leaflet polyline.
  segments.forEach((segment) => {
    const line = L.polyline(segment, {
      color: "#38bdf8",
      weight: 3,
      opacity: 0.8,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    trackLines.push(line);
  });
}


function formatDuration(milliseconds) {
  const totalSeconds = Math.max(
    0,
    Math.floor(milliseconds / 1000)
  );

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

function formatTimeSince(timestamp) {
  if (timestamp === null) {
    return "Waiting...";
  }

  const elapsed = Math.max(0, Date.now() - timestamp);

  if (elapsed < 1000) {
    return "Just now";
  }

  return `${formatDuration(elapsed)} ago`;
}

function updateOrbitalStatistics() {
  elements.positionsCount.textContent = trackHistory.length;

  if (trackTimestamps.length >= 2) {
    const firstTimestamp = trackTimestamps[0];
    const latestTimestamp =
      trackTimestamps[trackTimestamps.length - 1];

    elements.trailDuration.textContent = formatDuration(
      latestTimestamp - firstTimestamp
    );
  } else if (trackTimestamps.length === 1) {
    elements.trailDuration.textContent = "0m 0s";
  } else {
    elements.trailDuration.textContent = "--";
  }

  elements.lastSuccess.textContent =
    formatTimeSince(lastSuccessfulUpdate);
}

function clearTrackHistory() {
  trackHistory.length = 0;
  trackTimestamps.length = 0;

  updateGroundTrack();
  updateOrbitalStatistics();

  setStatus("Live");
}

function exportTrackCSV() {
  if (trackHistory.length === 0) {
    alert("No track history available to export.");
    return;
  }

  const rows = [
    ["Timestamp (UTC)", "Latitude", "Longitude"]
  ];

  for (let i = 0; i < trackHistory.length; i++) {
    const [latitude, longitude] = trackHistory[i];
    const timestamp = new Date(trackTimestamps[i]).toISOString();

    rows.push([
      timestamp,
      latitude,
      longitude
    ]);
  }

  const csvContent = rows
    .map(row => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "iss-track-history.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

// Prevent overlapping requests.
let isFetching = false;

const elements = {
  latitude: document.getElementById("latitude"),
  longitude: document.getElementById("longitude"),
  altitude: document.getElementById("altitude"),
  velocity: document.getElementById("velocity"),
  updatedAt: document.getElementById("updated-at"),
  statusText: document.getElementById("status-text"),
  statusDot: document.getElementById("status-dot"), 
  followButton: document.getElementById("follow-button"),
  followButtonText: document.getElementById("follow-button-text"),
  followIndicator: document.getElementById("follow-indicator"),
  positionsCount: document.getElementById("positions-count"),
  trailDuration: document.getElementById("trail-duration"),
  lastSuccess: document.getElementById("last-success"),
  trackingStatus: document.getElementById("tracking-status"),
  exportCsvButton: document.getElementById("export-csv"),
  clearTrackButton: document.getElementById("clear-track"),
};

let followEnabled = true;

function updateFollowButton() {
  elements.followButtonText.textContent = followEnabled
    ? "Following ISS"
    : "Follow ISS";

  elements.followButton.classList.toggle("active", followEnabled);

  elements.followButton.setAttribute(
    "aria-pressed",
    String(followEnabled)
  );

  elements.followIndicator.classList.toggle("active", followEnabled);
}

elements.followButton.addEventListener("click", () => {
  followEnabled = !followEnabled;

  updateFollowButton();

  if (followEnabled) {
    map.panTo(issMarker.getLatLng(), {
      animate: true,
      duration: 0.8,
    });
  }
});

updateFollowButton();

function setStatus(status) {
  elements.statusText.textContent = status;
  elements.trackingStatus.textContent = status;

  elements.statusDot.classList.remove("online", "offline");

  if (status === "Live") {
    elements.statusDot.classList.add("online");
  } else if (status === "Offline") {
    elements.statusDot.classList.add("offline");
  }
}

function formatNumber(value, digits = 2) {
  return Number(value).toFixed(digits);
}

async function updateISS() {
  if (isFetching) return;

  isFetching = true;

  try {
    const response = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API returned HTTP ${response.status}`);
    }

    const data = await response.json();

    const latitude = Number(data.latitude);
    const longitude = Number(data.longitude);
    const altitude = Number(data.altitude);
    const velocity = Number(data.velocity);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      !Number.isFinite(altitude) ||
      !Number.isFinite(velocity) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new Error("API returned invalid telemetry");
    }

    // Update the marker's geographical position.
    issMarker.setLatLng([latitude, longitude]);

    
    // Record the successful coordinate reading and its timestamp.
    const recordedAt = Date.now();

    trackHistory.push([latitude, longitude]);
    trackTimestamps.push(recordedAt);

    lastSuccessfulUpdate = recordedAt;

    // Keep both histories synchronized and bounded.
    if (trackHistory.length > MAX_TRACK_POINTS) {
      trackHistory.shift();
      trackTimestamps.shift();
    }

    // Refresh the ground track and its statistics.
    updateGroundTrack();
    updateOrbitalStatistics();
    
    if (followEnabled) {
        map.panTo([latitude, longitude], {
        animate: true,
        duration: 0.8,
      });
    }

    // Update the dashboard.
    elements.latitude.textContent = `${formatNumber(latitude, 4)}°`;
    elements.longitude.textContent = `${formatNumber(longitude, 4)}°`;
    elements.altitude.textContent = `${formatNumber(altitude)} km`;
    elements.velocity.textContent = `${Math.round(velocity).toLocaleString()} km/h`;

    // Display the API timestamp in UTC.
    elements.updatedAt.textContent =
      `Updated: ${new Date(data.timestamp * 1000).toISOString().slice(11, 19)} UTC`;

    issMarker.setPopupContent(
      `ISS Position<br>Latitude: ${latitude.toFixed(4)}°<br>` +
      `Longitude: ${longitude.toFixed(4)}°`
    );

    setStatus("Live");

  } catch (error) {
    console.error("ISS update failed:", error);
    setStatus("Offline");
    elements.updatedAt.textContent = "Update failed — retrying...";
  } finally {
    isFetching = false;
  }
}

elements.clearTrackButton.addEventListener(
  "click",
  clearTrackHistory
);

elements.exportCsvButton.addEventListener(
  "click",
  exportTrackCSV
);

 // Fetch once immediately, then poll periodically.
updateISS();

setInterval(updateISS, REFRESH_INTERVAL);

// Refresh the elapsed-time display once per second.
setInterval(updateOrbitalStatistics, 1000);