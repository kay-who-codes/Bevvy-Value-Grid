function formatNumber(num) {
    // Round to 2 decimal places
    const rounded = Number(num.toFixed(2));
    // Remove trailing zeros and unnecessary decimal points
    return rounded.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function calculateValue(volume, alcohol, price) {
    if (!volume || !alcohol || !price || price <= 0) return '-';
    const value = (volume * (alcohol / 100)) / price;
    return formatNumber(value);
}

function generateGrid() {
    const volume = parseFloat(document.getElementById('volume').value);
    const centerAlcohol = parseFloat(document.getElementById('alcohol').value);
    const centerPrice = parseFloat(document.getElementById('price').value);

    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';

    if (!volume || !centerAlcohol || !centerPrice) return;

    // Generate price headers
    const prices = [];
    for (let i = -4; i <= 4; i++) {
        prices.push(centerPrice + (i * 0.25));
    }

    // Generate alcohol percentages
    const alcoholPercentages = [];
    for (let i = 4; i >= -4; i--) {
        alcoholPercentages.push(centerAlcohol + (i * 0.5));
    }

    // Create table
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>${formatNumber(volume)} ml</th>`;
    
    // Add price headers
    prices.forEach(price => {
        const th = document.createElement('th');
        th.textContent = `£${formatNumber(price)}`;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Add data rows
    alcoholPercentages.forEach(alcohol => {
        const tr = document.createElement('tr');
        const alcoholHeader = document.createElement('th');
        alcoholHeader.textContent = `${formatNumber(alcohol)}%`;
        tr.appendChild(alcoholHeader);

        prices.forEach(price => {
            const td = document.createElement('td');
            const value = calculateValue(volume, alcohol, price);
            td.textContent = value;
            
            if (alcohol === centerAlcohol && price === centerPrice) {
                td.classList.add('highlight');
            }
            
            tr.appendChild(td);
        });

        table.appendChild(tr);
    });

    // Add hover event listeners
    table.addEventListener('mouseover', function(e) {
        if (e.target.tagName === 'TD') {
            const td = e.target;
            const tr = td.parentElement;
            
            // Highlight row
            table.classList.add('highlight-row');
            Array.from(tr.children).forEach(cell => {
                if (cell.tagName === 'TD') cell.classList.add('highlighted-row');
            });
            
            // Highlight column
            table.classList.add('highlight-column');
            const colIndex = td.cellIndex;
            Array.from(table.rows).forEach(row => {
                if (row.cells[colIndex]) row.cells[colIndex].classList.add('highlighted-column');
            });
        }
    });

    table.addEventListener('mouseout', function(e) {
        if (e.target.tagName === 'TD') {
            const table = e.target.closest('table');
            table.classList.remove('highlight-row', 'highlight-column');
            table.querySelectorAll('.highlighted-row, .highlighted-column').forEach(el => {
                el.classList.remove('highlighted-row', 'highlighted-column');
            });
        }
    });

    gridContainer.appendChild(table);
}

// Add event listeners
document.getElementById('volume').addEventListener('input', generateGrid);
document.getElementById('alcohol').addEventListener('input', generateGrid);
document.getElementById('price').addEventListener('input', generateGrid);

// Initial grid generation
generateGrid();
