(() => {
	'use strict';

	const fileInput = document.getElementById('fileInput');
	const selectDevice = document.getElementById('selectDevice');
	const selectTimeRange = document.getElementById('selectTimeRange');
	const tableHead = document.querySelector('#table thead');
	const tableBody = document.querySelector('#table tbody');
	const ctx = document.getElementById('myChart').getContext('2d');

	let parsedData = [];
	let chart = null;

	fileInput.addEventListener('change', handleFile);
	selectDevice.addEventListener('change', updateChart);
	selectTimeRange.addEventListener('change', updateChart);

	function handleFile(e) {
		const file = e.target.files && e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			const text = reader.result;
			parsedData = parseCSV(text);
			renderTable(parsedData);
			populateDeviceSelect(parsedData);
			updateChart();
		};
		reader.readAsText(file);
	}

	function parseCSV(text) {
		const lines = text.trim().split(/\r?\n/).filter(Boolean);
		if (!lines.length) return [];

		const headers = lines[0].split(',').map(h => h.trim());
		return lines.slice(1).map(line => {
			const cols = line.split(',');
			const obj = {};
			headers.forEach((h, i) => obj[h] = (cols[i] || '').trim());
			return obj;
		});
	}

	function renderTable(data) {
		tableHead.innerHTML = '';
		tableBody.innerHTML = '';
		if (!data.length) return;

		const headers = Object.keys(data[0]);
		const tr = document.createElement('tr');
		headers.forEach(h => {
			const th = document.createElement('th');
			th.textContent = h;
			tr.appendChild(th);
		});
		tableHead.appendChild(tr);

		data.forEach(row => {
			const r = document.createElement('tr');
			headers.forEach(h => {
				const td = document.createElement('td');
				td.textContent = row[h] ?? '';
				r.appendChild(td);
			});
			tableBody.appendChild(r);
		});
	}

	function populateDeviceSelect(data) {
		// try common device column names
		const deviceKeys = ['device', 'Device', 'deviceId', 'device_id', 'id'];
		const headers = data.length ? Object.keys(data[0]) : [];
		const deviceKey = headers.find(h => deviceKeys.includes(h)) || headers[0] || null;

		const devices = new Set();
		if (deviceKey) data.forEach(d => devices.add(d[deviceKey] || ''));

		// reset select
		selectDevice.innerHTML = '';
		const optAll = document.createElement('option');
		optAll.value = '';
		optAll.textContent = 'All Devices';
		selectDevice.appendChild(optAll);

		Array.from(devices).filter(Boolean).forEach(dev => {
			const opt = document.createElement('option');
			opt.value = dev;
			opt.textContent = dev;
			selectDevice.appendChild(opt);
		});
	}

	function findColumns(data) {
		if (!data.length) return { timeKey: null, valueKey: null };
		const headers = Object.keys(data[0]);
		const timeCandidates = ['timestamp', 'time', 'date', 'ts'];
		const valueCandidates = ['value', 'reading', 'temperature', 'temp', 'val'];

		const timeKey = headers.find(h => timeCandidates.includes(h.toLowerCase()));
		let valueKey = headers.find(h => valueCandidates.includes(h.toLowerCase()));

		if (!valueKey) {
			// fallback to first numeric column
			for (const h of headers) {
				if (data.some(r => r[h] && !isNaN(Number(r[h])))) {
					valueKey = h;
					break;
				}
			}
		}

		return { timeKey, valueKey };
	}

	function updateChart() {
		if (!parsedData.length) return;

		const selectedDevice = selectDevice.value;
		const timeRange = selectTimeRange.value; // 'all' or number

		const { timeKey, valueKey } = findColumns(parsedData);

		let filtered = parsedData.filter(d => (selectedDevice ? Object.values(d).includes(selectedDevice) : true));

		if (timeRange && timeRange !== 'all') {
			const n = parseInt(timeRange, 10) || filtered.length;
			filtered = filtered.slice(-n);
		}

		const labels = [];
		const values = [];

		filtered.forEach((row, idx) => {
			const label = timeKey ? row[timeKey] : (idx + 1).toString();
			labels.push(label);
			const v = valueKey ? Number(row[valueKey]) : NaN;
			values.push(isNaN(v) ? null : v);
		});

		const datasets = [{
			label: valueKey || 'Value',
			data: values,
			borderColor: 'rgba(75, 192, 192, 1)',
			backgroundColor: 'rgba(75, 192, 192, 0.2)',
			fill: false,
		}];

		if (chart) chart.destroy();
		chart = new Chart(ctx, {
			type: 'line',
			data: { labels, datasets },
			options: {
				responsive: true,
				scales: {
					x: { display: true },
					y: { display: true }
				}
			}
		});
	}

	// Setup reasonable defaults for time-range select if empty
	(function setupDefaults() {
		if (selectTimeRange.options.length === 1) {
			selectTimeRange.innerHTML = '';
			const opts = [
				{ v: 'all', t: 'All' },
				{ v: '10', t: 'Last 10' },
				{ v: '50', t: 'Last 50' },
				{ v: '100', t: 'Last 100' }
			];
			opts.forEach(o => {
				const opt = document.createElement('option');
				opt.value = o.v;
				opt.textContent = o.t;
				selectTimeRange.appendChild(opt);
			});
		}
	})();

})();
