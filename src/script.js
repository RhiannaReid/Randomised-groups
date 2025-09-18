// Save button logic
document.getElementById('saveBtn').addEventListener('click', function() {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv.innerText.trim()) {
        alert('No teams to save!');
        return;
    }
    let text = '';
    // Convert HTML results to plain text
    const teams = resultsDiv.querySelectorAll('.team');
    teams.forEach((team, i) => {
        const title = team.querySelector('.team-title').innerText;
        text += title + '\n';
        const members = team.querySelectorAll('li');
        members.forEach(member => {
            text += '  - ' + member.innerText + '\n';
        });
        text += '\n';
    });
    // Download as text file
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'teams.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
// Reset button logic
document.getElementById('resetBtn').addEventListener('click', function() {
    document.getElementById('numPeople').value = '';
    document.getElementById('numTeams').value = '';
    document.getElementById('namesContainer').innerHTML = '';
    document.getElementById('results').innerHTML = '';
});
document.getElementById('sortForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const numPeople = parseInt(document.getElementById('numPeople').value);
    const numTeams = parseInt(document.getElementById('numTeams').value);
    if (numTeams > numPeople) {
        document.getElementById('results').innerHTML = '<p style="color:#ff6666">Teams cannot exceed number of people.</p>';
        return;
    }
    // Get custom names
    let people = [];
    let valid = true;
    for (let i = 0; i < numPeople; i++) {
        const nameInput = document.getElementById('personName' + i);
        let name = nameInput ? nameInput.value.trim() : '';
        if (!name) {
            valid = false;
            name = 'Person ' + (i + 1);
        }
        people.push(name);
    }
    if (!valid) {
        document.getElementById('results').innerHTML = '<p style="color:#ff6666">Please enter all names.</p>';
        return;
    }
    // Shuffle
    for (let i = people.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [people[i], people[j]] = [people[j], people[i]];
    }
    // Distribute into teams
    let teams = Array.from({length: numTeams}, () => []);
    people.forEach((person, idx) => {
        teams[idx % numTeams].push(person);
    });
    // Display
    let html = '';
    teams.forEach((team, i) => {
        html += `<div class=\"team\"><div class=\"team-title\">Team ${i+1}</div><ul>`;
        team.forEach(member => {
            html += `<li>${member}</li>`;
        });
        html += '</ul></div>';
    });
    document.getElementById('results').innerHTML = html;
});

// Dynamically show name inputs when number of people changes
document.getElementById('numPeople').addEventListener('input', function() {
    const numPeople = parseInt(this.value);
    const namesContainer = document.getElementById('namesContainer');
    namesContainer.innerHTML = '';
    if (numPeople >= 2) {
        for (let i = 0; i < numPeople; i++) {
            const nameBox = document.createElement('div');
            nameBox.className = 'name-box';
            const label = document.createElement('label');
            label.textContent = `Name for Person ${i+1}:`;
            label.setAttribute('for', 'personName' + i);
            const input = document.createElement('input');
            input.type = 'text';
            input.id = 'personName' + i;
            input.name = 'personName' + i;
            input.required = true;
            input.className = 'person-name-input';
            nameBox.appendChild(label);
            nameBox.appendChild(input);
            namesContainer.appendChild(nameBox);
        }
    }
});
