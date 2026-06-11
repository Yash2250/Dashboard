let csvData = [];
let chart = null;

const fileInput = document.getElementById("csvFile");
const sensorSelect = document.getElementById("sensorSelect");
const timestampText = document.getElementById("timestampText");

fileInput.addEventListener("change", function (e) {

    const file = e.target.files[0];

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,

        complete: function (results) {

            csvData = results.data;

            const sensorIds = new Set();

            csvData.forEach(row => {

                try {

                    let sensors = JSON.parse(row.sensors);

                    sensors.forEach(sensor => {
                        sensorIds.add(sensor.id);
                    });

                } catch (err) {
                    console.log("JSON Error:", err);
                }
            });

            sensorSelect.innerHTML =
                '<option value="">Select Sensor</option>';

            sensorIds.forEach(id => {

                const option =
                    document.createElement("option");

                option.value = id;
                option.textContent = id;

                sensorSelect.appendChild(option);
            });
        }
    });
});

sensorSelect.addEventListener("change", function () {

    const selectedSensor = this.value;

    if (!selectedSensor) {
        timestampText.textContent = "Timestamp: Select a sensor";
        if (chart) {
            chart.destroy();
            chart = null;
        }
        return;
    }

    const timestamps = [];
    const sensorValues = [];

    csvData.forEach(row => {

        try {

            let sensors = JSON.parse(row.sensors);

            const sensor = sensors.find(
                s => s.id === selectedSensor
            );

            if (sensor) {

                let time =
                    row.createdAt ||
                    row.timestamp ||
                    row.time;

                const timeLabel = new Date(time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });

                timestamps.push(
                    timeLabel
                );

                sensorValues.push(sensor.data);
            }

        } catch (err) {
            console.log(err);
        }
    });

    timestampText.textContent =
        timestamps.length > 0
            ? `Timestamp: ${timestamps[timestamps.length - 1]}`
            : "Timestamp: No data found";

    drawChart(
        timestamps,
        sensorValues,
        selectedSensor
    );
});

function drawChart(labels, values, sensorId) {

    const ctx =
        document.getElementById("myChart");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{
                label: sensorId,
                data: values,
                tension: 0.3
            }]
        },

        options: {

            responsive: true,

            interaction: {
                intersect: false,
                mode: "index"
            },

            plugins: {
                legend: {
                    display: true
                }
            },

            scales: {

                x: {
                    title: {
                        display: true,
                        text: "Time"
                    }
                },

                y: {
                    title: {
                        display: true,
                        text: "Sensor Value"
                    }
                }
            }
        }
    });
}
