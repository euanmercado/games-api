const API_URL = 'http://127.0.0.1:5000/games';

// DOM Elements
const catalogGrid = document.getElementById('catalog-grid');
const alertBox = document.getElementById('alert-box');
const gameCount = document.getElementById('game-count');
const addGameBtn = document.getElementById('add-game-btn');
const refreshBtn = document.getElementById('refresh-btn');

// Form Modal
const formModal = document.getElementById('form-modal');
const gameForm = document.getElementById('game-form');
const modalFormTitle = document.getElementById('modal-form-title');
const closeFormBtn = document.getElementById('close-form-btn');
const cancelFormBtn = document.getElementById('cancel-form-btn');

// Inputs
const gameIdInput = document.getElementById('game-id');
const titleInput = document.getElementById('title');
const platformInput = document.getElementById('platform');
const genreInput = document.getElementById('genre');
const yearInput = document.getElementById('release_year');
const imageInput = document.getElementById('image_url');
const descriptionInput = document.getElementById('description');

// Detail Modal
const detailModal = document.getElementById('detail-modal');
const closeDetailBtn = document.getElementById('close-detail-btn');
const detailCoverWrapper = document.getElementById('detail-cover-wrapper');
const detailTitle = document.getElementById('detail-title');
const detailPlatform = document.getElementById('detail-platform');
const detailGenre = document.getElementById('detail-genre');
const detailYear = document.getElementById('detail-year');
const detailDescription = document.getElementById('detail-description');
const detailEditBtn = document.getElementById('detail-edit-btn');
const detailDeleteBtn = document.getElementById('detail-delete-btn');

// Confirm Delete Modal
const deleteModal = document.getElementById('delete-modal');
const deleteGameTitle = document.getElementById('delete-game-title');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

let activeGameData = null; // Store currently viewed item for Edit/Delete

// Helper: UI Alerts
function showAlert(message, type = 'danger') {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.classList.remove('hidden');
    setTimeout(() => alertBox.classList.add('hidden'), 5000);
}

// 1. GET /games - List View (with Loading State & Error Handling)
async function fetchGames() {
    // Basic Loading State
    catalogGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-secondary);">
            <h2>⚡ Loading game catalog...</h2>
        </div>
    `;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Server returned HTTP ${response.status}`);
        }
        const games = await response.json();
        renderCatalog(games);
    } catch (err) {
        // Graceful 404 / Connection Error Handling
        catalogGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #fca5a5; background: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2);">
                <h3>⚠️ Error Loading Data</h3>
                <p style="margin-top:0.5rem;">Cannot connect to API at ${API_URL}. Ensure 'py app.py' is running!</p>
            </div>
        `;
        gameCount.textContent = '0 Games';
        showAlert('API Connection Error. Please verify backend server is active.', 'danger');
    }
}

// Render Grid Cards
function renderCatalog(games) {
    catalogGrid.innerHTML = '';
    gameCount.textContent = `${games.length} ${games.length === 1 ? 'Game' : 'Games'}`;

    if (games.length === 0) {
        catalogGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
                <p>No games in catalog. Click "+ Add New Game" above to get started!</p>
            </div>
        `;
        return;
    }

    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.onclick = () => openDetailModal(game.id);

        const imageContent = game.image_url 
            ? `<img src="${game.image_url}" class="game-cover" alt="${escapeHtml(game.title)}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'game-cover-placeholder\\'>🎮</div>';">`
            : `<div class="game-cover-placeholder">🎮</div>`;

        card.innerHTML = `
            <div class="game-cover-wrapper">${imageContent}</div>
            <div class="game-details">
                <h3 class="game-title">${escapeHtml(game.title)}</h3>
                <div class="game-meta">
                    <span class="tag tag-platform">${escapeHtml(game.platform)}</span>
                    <span class="tag">${escapeHtml(game.genre)}</span>
                    <span class="tag tag-year">${game.release_year}</span>
                </div>
            </div>
        `;

        catalogGrid.appendChild(card);
    });
}

// 2. GET /games/<id> - Detail View Fetch
async function openDetailModal(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        // Handle 404 gracefully
        if (response.status === 404) {
            const errData = await response.json();
            showAlert(errData.error || 'Game not found (404)', 'danger');
            fetchGames();
            return;
        }

        if (!response.ok) throw new Error('Failed to fetch game details.');

        const game = await response.json();
        activeGameData = game; // Save for Edit/Delete

        detailCoverWrapper.innerHTML = game.image_url 
            ? `<img src="${game.image_url}" class="game-cover" alt="${escapeHtml(game.title)}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'game-cover-placeholder\\'>🎮</div>';">`
            : `<div class="game-cover-placeholder">🎮</div>`;

        detailTitle.textContent = game.title;
        detailPlatform.textContent = game.platform;
        detailGenre.textContent = game.genre;
        detailYear.textContent = `Released: ${game.release_year}`;
        detailDescription.textContent = game.description || 'No detailed description provided.';

        detailModal.classList.remove('hidden');
    } catch (err) {
        showAlert('Failed to load item details from server.', 'danger');
    }
}

// Open Form Modal (Add/Edit)
function openFormModal(game = null) {
    if (game) {
        modalFormTitle.textContent = 'Edit Game';
        gameIdInput.value = game.id;
        titleInput.value = game.title;
        platformInput.value = game.platform;
        genreInput.value = game.genre;
        yearInput.value = game.release_year;
        imageInput.value = game.image_url || '';
        descriptionInput.value = game.description || '';
    } else {
        modalFormTitle.textContent = 'Add New Game';
        gameForm.reset();
        gameIdInput.value = '';
    }
    formModal.classList.remove('hidden');
}

function closeModals() {
    formModal.classList.add('hidden');
    detailModal.classList.add('hidden');
    deleteModal.classList.add('hidden');
}

// 3 & 4. POST / PUT Form Submission with API 400 Validation Error handling
gameForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        title: titleInput.value.trim(),
        platform: platformInput.value.trim(),
        genre: genreInput.value.trim(),
        release_year: yearInput.value ? parseInt(yearInput.value, 10) : null,
        image_url: imageInput.value.trim(),
        description: descriptionInput.value.trim()
    };

    const id = gameIdInput.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        // 400 Bad Request or error handling
        if (!res.ok) {
            showAlert(data.error || `Error ${res.status}: Action failed`, 'danger');
            return;
        }

        closeModals();
        fetchGames();
        showAlert(id ? 'Game updated successfully!' : 'New game added!', 'success');
    } catch (err) {
        showAlert('Server communication error.', 'danger');
    }
});

// 5. DELETE /games/<id>
detailDeleteBtn.addEventListener('click', () => {
    if (!activeGameData) return;
    deleteGameTitle.textContent = `"${activeGameData.title}"`;
    deleteModal.classList.remove('hidden');
});

confirmDeleteBtn.addEventListener('click', async () => {
    if (!activeGameData) return;

    try {
        const res = await fetch(`${API_URL}/${activeGameData.id}`, { method: 'DELETE' });
        const data = await res.json();

        if (!res.ok) {
            showAlert(data.error || 'Failed to delete game.', 'danger');
            return;
        }

        closeModals();
        fetchGames();
        showAlert('Game deleted successfully.', 'success');
    } catch (err) {
        showAlert('Failed to delete game.', 'danger');
    }
});

// Edit Button Trigger
detailEditBtn.addEventListener('click', () => {
    if (!activeGameData) return;
    detailModal.classList.add('hidden');
    openFormModal(activeGameData);
});

// Trigger API 400 Validation Demo (for Video Recording)
// Bypasses browser client validation to send invalid JSON to API
window.triggerValidationDemo = async function() {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: '' }) // missing required fields!
        });
        const data = await res.json();
        showAlert(data.error, 'danger');
    } catch (err) {
        showAlert('Failed to trigger demo', 'danger');
    }
};

// Listeners
addGameBtn.addEventListener('click', () => openFormModal());
refreshBtn.addEventListener('click', fetchGames);
closeFormBtn.addEventListener('click', closeModals);
cancelFormBtn.addEventListener('click', closeModals);
closeDetailBtn.addEventListener('click', closeModals);
cancelDeleteBtn.addEventListener('click', () => deleteModal.classList.add('hidden'));

[formModal, detailModal, deleteModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModals();
    });
});

function escapeHtml(str) {
    return str ? str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
}

// Initial List Fetch
fetchGames();