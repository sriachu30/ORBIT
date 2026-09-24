
# ORBIT: Orbital Real-time Beacon & ISS Tracker 🛰️

> Track the International Space Station in real time, explore its movement around Earth, and visualize its recent orbital path.

🌍 **Live Application:** [https://orbit-achu7.vercel.app/](https://orbit-achu7.vercel.app/)

---

## What is an ISS Tracker?

An **ISS Tracker** is a tool that displays the location of the International Space Station (ISS) as it travels around Earth.

The ISS is a habitable space station that serves as an orbiting laboratory for scientific research, technology demonstrations, and international cooperation in space.

Because the station is constantly moving, an ISS tracker uses location data to represent its position on a map and help users follow its journey around the planet.

ORBIT brings this information into an interactive web application, making it easier to observe the station's movement and understand its orbital journey.

---

## Why Track the ISS?

Tracking the ISS can help people:

- **Understand orbital motion:** Observe how the station moves around Earth instead of treating space as a static environment.
- **Explore space science:** Develop a more intuitive understanding of satellites, orbital paths, and human activity in space.
- **Visualize location data:** See how numerical latitude and longitude values translate into a real-world position.
- **Explore technology:** Understand how APIs, mapping libraries, and periodic data updates can work together in a live application.
- **Learn interactively:** Turn space-related information into an experience that users can explore themselves.

---

## How ORBIT Helps

ORBIT combines live ISS location data with an interactive map and useful tracking features.

Instead of simply displaying coordinates, it presents the station's movement in a visual and accessible format.

### Key Features

| Feature | Description |
|---|---|
| 🛰️ Live ISS Position | Retrieves the station's latitude, longitude, altitude, and velocity data. |
| 🌍 Interactive Map | Displays the ISS position on a map using Leaflet and OpenStreetMap. |
| 🔄 Automatic Updates | Refreshes the station's location periodically, approximately every 5 seconds. |
| 🎯 Follow ISS | Allows users to keep the map centered on the station as it moves. |
| 🛤️ Ground Track | Displays the recent sequence of recorded positions to visualize the station's path. |
| 📊 Orbital Statistics | Presents useful location and movement information for the ISS. |
| 🧹 Clear Track | Clears the recorded ground-track points from the current view. |
| 📁 CSV Export | Allows users to export recorded tracking data for further exploration or analysis. |
| 📱 Responsive Interface | Provides a layout designed to work across different screen sizes. |

---

## How to Use ORBIT

1. Open the [ORBIT Live Application](https://orbit-achu7.vercel.app/).
2. View the ISS marker on the interactive world map.
3. Observe the station's location and orbital statistics.
4. Enable **Follow ISS** to keep the station in view as its position updates.
5. Explore the ground track to see its recently recorded movement.
6. Use **Clear Track** to clear the displayed track.
7. Use **CSV Export** to save the available tracking data for further analysis.

---

## How It Works

ORBIT follows a simple data-to-visualization workflow:

1. **Fetch location data:** The application requests ISS position information from the Where the ISS at API.
2. **Update periodically:** The application retrieves fresh data at regular intervals.
3. **Render the position:** Leaflet displays the latest coordinates on an interactive map.
4. **Record the path:** The application maintains a limited history of recent positions to construct the ground track.
5. **Display information:** The interface presents the available orbital statistics and tracking status.
6. **Export data:** Users can export the recorded tracking information as a CSV file.

The application uses a recent-position history limit to keep the ground-track visualization manageable.

---

## Technology Stack

- **HTML5** - Application structure
- **CSS3** - Styling and responsive interface
- **JavaScript** - Application logic and periodic data updates
- **Vite** - Development server and production build tooling
- **Leaflet** - Interactive mapping
- **OpenStreetMap** - Map tiles
- **Where the ISS at API** - ISS location data
- **Vercel** - Application deployment
- **Git & GitHub** - Version control and source-code hosting

---

## Data Source

ORBIT retrieves ISS location information from:

[Where the ISS at API](https://api.wheretheiss.at/v1/satellites/25544)

The API provides location and movement data associated with the ISS. ORBIT uses the returned information to update the map and tracking interface.

**Note:** The displayed position and statistics depend on the availability and freshness of the external data source. This application is an educational visualization tool and should not be treated as an authoritative operational tracking system.

---

## Project Objectives

ORBIT was developed to:

- Build a practical, interactive application using JavaScript.
- Integrate an external API into a real-time-style web interface.
- Work with geographic coordinates and map visualizations.
- Implement periodic updates and maintain a history of location data.
- Explore data export functionality.
- Practice the process of developing, version-controlling, and deploying a web application.

---

## Future Improvements

Potential future enhancements include:

- Pass prediction and approximate visibility windows.
- Historical ground-track playback.
- Additional orbital visualizations.
- More detailed tracking analytics.
- Improved error handling and connection-status feedback.
- A 3D visualization of Earth and the ISS orbit.

---

## Run Locally

### Prerequisites

- Node.js
- npm
- Git

### Installation

```bash
git clone https://github.com/sriachu30/ORBIT.git
cd ORBIT
npm install
```

### Start the development server

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

### Create a production build

```bash
npm run build
```

The production build is generated in the `dist` directory.

---

## Links

- **Live Application:** [orbit-achu7.vercel.app](https://orbit-achu7.vercel.app/)
- **GitHub Repository:** [github.com/sriachu30/ORBIT](https://github.com/sriachu30/ORBIT)
- **ISS Data API:** [Where the ISS at](https://api.wheretheiss.at/v1/satellites/25544)

---

## Author

**Sri Achyuta**

GitHub: [@sriachu30](https://github.com/sriachu30)

---

## Disclaimer

ORBIT is an educational and informational project created to visualize ISS location data. It is not affiliated with NASA, the ISS program, or the API provider. Location information and visualizations may be subject to data-source delays, outages, or inaccuracies.

---

**Look up. Track the orbit. Explore space.** 🛰️🌍
