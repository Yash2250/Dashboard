# 📊Dashboard

A lightweight, browser-based dashboard for visualizing IoT and sensor data directly from CSV files. Upload a CSV, select a device and sensor, explore trends through interactive charts, analyze statistics, and export filtered results—all without a backend server.

---

## ✨ Features

- 📁 Upload CSV files from your local machine
- 🖱️ Drag-and-drop file support
- 🔍 Device-based filtering
- 🎛️ Dynamic sensor selection
- 📈 Interactive line charts powered by Chart.js
- ⏱️ Time-range filtering
- 📊 Real-time statistics:
  - Latest Value
  - Average Value
  - Minimum Value
  - Maximum Value
  - Reading Count
- 📤 Export filtered sensor data to CSV
- 🌐 Runs entirely in the browser

---

## 📸 Dashboard Workflow

```text
CSV File
    │
    ▼
CSV Parser
    │
    ▼
Device Detection
    │
    ▼
Sensor Detection
    │
    ▼
Data Filtering
    │
    ▼
Statistics + Chart Visualization
    │
    ▼
CSV Export
```

---

## 🏗️ Project Structure

```text
.
├── index.html
├── script.js
└── README.md
```

---

## 📄 Expected CSV Format

The application expects records containing:

| Field | Description |
|---------|-------------|
| device_id | Unique device identifier |
| timestamp / local_timestamp / utc_timestamp | Sensor timestamp |
| sensors | JSON array containing sensor data |

### Example

```csv
device_id,local_timestamp,sensors
DEV001,2025-06-01 10:00:00,"[{""id"":""temperature"",""data"":28.5,""fault"":false}]"
```

### Sensor Object

```json
{
  "id": "temperature",
  "data": 28.5,
  "fault": false
}
```

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/csv-sensor-dashboard.git
cd csv-sensor-dashboard
```

### Run Locally

#### Option 1: Open Directly

Open `index.html` in your browser.

#### Option 2: Start a Local Server

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

---

## 🧠 How It Works

### 1. Upload Data

Upload a CSV file using the file picker or drag-and-drop area.

### 2. Parse CSV

The application:

- Reads the file
- Parses timestamps
- Extracts sensor data
- Stores records in memory

### 3. Select Device

The dashboard automatically identifies available devices and populates the dropdown.

### 4. Select Sensor

Available sensors are dynamically loaded based on the selected device.

### 5. Visualize Data

Sensor readings are displayed in an interactive line chart.

### 6. Analyze Statistics

The dashboard calculates:

- Latest Reading
- Average Reading
- Minimum Reading
- Maximum Reading
- Total Readings

### 7. Export Results

Filtered records can be downloaded as a CSV file.

---

## 🛠️ Built With

- HTML5
- Vanilla JavaScript (ES6)
- Chart.js

---

## 🔮 Future Enhancements

- Multiple charts on a single dashboard
- Temperature & humidity comparison views
- Date-range picker
- Real-time MQTT/WebSocket integration
- Dark mode
- Mobile-responsive UI improvements
- Device health monitoring
- Alert and notification system

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed for sensor data visualization and device monitoring using CSV-based datasets.
