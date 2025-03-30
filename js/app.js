function formatNumber(num) {
    // Round to 2 decimal places
    const rounded = Number(num.toFixed(2));
    // Remove trailing zeros and unnecessary decimal points
    return rounded.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function safeEval(expression) {
    try {
        // Replace 'x' with '*' for multiplication
        const sanitized = expression.replace(/x/gi, '*');
        // Use Function constructor as a safer alternative to eval
        return new Function('return ' + sanitized)();
    } catch (e) {
        return NaN;
    }
}

function calculateValue(volume, alcohol, price) {
    const vol = typeof volume === 'string' ? safeEval(volume) : volume;
    const alc = typeof alcohol === 'string' ? safeEval(alcohol) : alcohol;
    const prc = typeof price === 'string' ? safeEval(price) : price;
    
    if (isNaN(vol) || isNaN(alc) || isNaN(prc) || prc <= 0) return '-';
    const value = (vol * (alc / 100)) / prc;
    return formatNumber(value);
}

function generateGrid() {
    const volume = document.getElementById('volume').value;
    const alcohol = document.getElementById('alcohol').value;
    const price = document.getElementById('price').value;

    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';

    // Calculate actual values from expressions
    const volValue = safeEval(volume);
    const alcValue = safeEval(alcohol);
    const priceValue = safeEval(price);

    if (isNaN(volValue)) { // ← Missing parenthesis in original
    gridContainer.innerHTML = '<p class="error">Invalid volume expression</p>';
    return;
}
    if (isNaN(alcValue)) {
        gridContainer.innerHTML = '<p class="error">Invalid ABV expression</p>';
        return;
    }
    if (isNaN(priceValue) || priceValue <= 0) {
        gridContainer.innerHTML = '<p class="error">Invalid price expression</p>';
        return;
    }

    // Generate price headers
    const prices = [];
    for (let i = -4; i <= 4; i++) {
        prices.push(priceValue + (i * 0.25));
    }

    // Generate alcohol percentages
    const alcoholPercentages = [];
    for (let i = 4; i >= -4; i--) {
        alcoholPercentages.push(alcValue + (i * 0.5));
    }

    // Create table
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>${formatNumber(volValue)} ml</th>`;
    
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
            const value = calculateValue(volValue, alcohol, price);
            td.textContent = value;
            
            if (alcohol === alcValue && price === priceValue) {
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
